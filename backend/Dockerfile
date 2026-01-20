FROM python:3.11-slim

WORKDIR /app

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
# Note: We copy everything, but .dockerignore should exclude venv/pycache
COPY . ./backend

# Set python path so backend.main works
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8000

# Command to run (host 0.0.0.0 is crucial for Docker networking)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
