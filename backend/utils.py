import io
import PyPDF2
import docx

def extract_text_from_pdf(file_stream):
    """Extracts text from a given PDF file stream."""
    reader = PyPDF2.PdfReader(file_stream)
    text = ""
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_stream):
    """Extracts text from a given DOCX file stream."""
    doc = docx.Document(file_stream)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text
