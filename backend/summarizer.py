import os
import re
import requests
import snowflake.connector
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def clean_summary(text: str) -> str:
    """Remove markdown-like bold markers from summary."""
    return re.sub(r"\*\*(.*?)\*\*", r"\1", text)

def build_multilingual_prompt(text: str, target_lang: str) -> str:
    if target_lang.lower() == "hindi":
        return (
            f"निम्नलिखित चिकित्सा नोट को सरल, रोगी-अनुकूल हिंदी में संक्षेप करें। "
            f"सभी अनुभाग शीर्षकों और सामग्री को देवनागरी लिपि में अनुवादित करें।\n\n{text}"
        )
    elif target_lang.lower() == "spanish":
        return (
            f"Escribe un resumen de la siguiente nota clínica utilizando un lenguaje sencillo y comprensible para el paciente. "
            f"Asegúrate de traducir todos los títulos y secciones al español. Responde solo en español.\n\n{text}"
        )
    elif target_lang.lower() == "french":
        return (
            f"Rédigez un résumé de la note clinique suivante en utilisant un langage clair et facile à comprendre pour le patient. "
            f"Veuillez traduire tous les titres et sections en français. Répondez uniquement en français.\n\n{text}"
        )
    else:
        return (
            f"Summarize the following clinical note in simple, patient-friendly English. "
            f"Translate all section headings and content into {target_lang}.\n\n{text}"
        )



def summarize_with_snowflake(text: str, target_lang: str = "English") -> str:
    """
    Summarizes the given clinical note using Snowflake Cortex COMPLETE().
    """
    conn = snowflake.connector.connect(
        user=os.getenv("SNOWFLAKE_USER"),
        password=os.getenv("SNOWFLAKE_PASSWORD"),
        account=os.getenv("SNOWFLAKE_ACCOUNT"),
        warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
        database=os.getenv("SNOWFLAKE_DATABASE"),
        schema=os.getenv("SNOWFLAKE_SCHEMA")
    )
    cursor = conn.cursor()

    try:
        prompt = build_multilingual_prompt(text, target_lang)

        query = f"""
        SELECT snowflake.cortex.complete(
            'llama3.1-8b',
            $$ {prompt} $$
        ) AS summary;
        """
        cursor.execute(query)
        row = cursor.fetchone()
        raw_summary = row[0] if row and row[0] else "No summary generated."
        return clean_summary(raw_summary).strip()

    except Exception as e:
        print(f"Error during summarization: {e}")
        return "An error occurred while summarizing the document."

    finally:
        cursor.close()
        conn.close()

def search_google_fallback(query: str) -> str:
    """
    Uses SerpAPI to search Google and return a snippet + top 3 clickable links (HTML).
    """
    params = {
        "engine": "google",
        "q": query,
        "api_key": os.getenv("SERPAPI_API_KEY")
    }

    try:
        res = requests.get("https://serpapi.com/search", params=params)
        results = res.json()

        snippet = ""
        if "answer_box" in results and "snippet" in results["answer_box"]:
            snippet = results["answer_box"]["snippet"]
        elif "organic_results" in results and results["organic_results"]:
            snippet = results["organic_results"][0].get("snippet", "")

        links = []
        for result in results.get("organic_results", [])[:3]:
            title = result.get("title", "Link")
            link = result.get("link", "")
            if title and link:
                links.append(f'<a href="{link}" target="_blank" rel="noopener noreferrer">{title}</a>')

        response = snippet.strip() if snippet else "Here are some helpful links:"
        if links:
            response += "<br><br><strong>Top Links:</strong><br>" + "<br>".join(links)

        return response

    except Exception as e:
        print("SerpAPI fallback failed:", e)
        return "Google search failed."

def ask_with_snowflake(note: str, question: str) -> str:
    """
    Answers a question based on the given clinical summary using Snowflake Cortex.
    Falls back to SerpAPI if the answer is vague, irrelevant, or hallucinated.
    """
    prompt = (
        "You are a helpful and cautious medical assistant. "
        "You should prioritize answering from the clinical summary below. "
        "If the answer is clearly stated in the summary, extract it. "
        "If the summary does not include the answer, respond with: "
        "'I'm not sure based on the summary. Please consult a doctor.'\n\n"
        f"Clinical Summary:\n{note}\n\n"
        f"User Question:\n{question}"
    )

    conn = snowflake.connector.connect(
        user=os.getenv("SNOWFLAKE_USER"),
        password=os.getenv("SNOWFLAKE_PASSWORD"),
        account=os.getenv("SNOWFLAKE_ACCOUNT"),
        warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
        database=os.getenv("SNOWFLAKE_DATABASE"),
        schema=os.getenv("SNOWFLAKE_SCHEMA")
    )
    cursor = conn.cursor()

    try:
        query = f"""
        SELECT snowflake.cortex.complete(
            'llama3.1-8b',
            $$ {prompt} $$
        ) AS answer;
        """
        cursor.execute(query)
        row = cursor.fetchone()
        answer = row[0].strip() if row and row[0] else ""

        bad_phrases = [
            "webmd", "check online", "i'm not sure",
            "consult your doctor", "not provided", "not mentioned",
            "john's wort", "over the counter", "drug interaction", "interact"
        ]

        if not answer or any(phrase in answer.lower() for phrase in bad_phrases):
            print("Falling back to SerpAPI...")
            return search_google_fallback(question)

        return answer

    except Exception as e:
        print(f"Error during LLM Q&A: {e}")
        return search_google_fallback(question)

    finally:
        cursor.close()
        conn.close()
