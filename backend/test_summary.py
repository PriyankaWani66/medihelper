from summarizer import summarize_with_snowflake

if __name__ == "__main__":
    test_note = """
    Patient presents with persistent cough and slight fever. Prescribed amoxicillin 500mg twice daily.
    Follow-up in 7 days if symptoms do not improve.
    """
    summary = summarize_with_snowflake(test_note)
    print("\nGenerated Summary:\n")
    print(summary)