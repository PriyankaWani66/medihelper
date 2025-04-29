import os
import snowflake.connector
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def summarize_with_snowflake(text: str) -> str:
    """
    Summarizes the given clinical note text using Snowflake Cortex COMPLETE().
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
        prompt = (
            "Summarize this clinical note in simple language, "
            "including follow-up instructions, medications, and risk factors:\n\n"
            f"{text}"
        )

        query = f"""
        SELECT snowflake.cortex.complete(
            'llama3.1-8b',      -- valid model name
            $$ {prompt} $$
        ) AS summary;
        """

        cursor.execute(query)
        row = cursor.fetchone()
        return row[0] if row and row[0] else "No summary generated."

    except Exception as e:
        print(f"Error during summarization: {e}")
        return "An error occurred while summarizing the document."

    finally:
        cursor.close()
        conn.close()
