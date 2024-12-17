# TerraChat
Target goal is to use free token(from multiple vendors) to achieve maximum cost-effective chat 


# Setup
1. Install dependencies:
```bash
pip install poetry
poetry install
npm install -g pnpm
cd frontend
pnpm install
```

2. Start the python server:
```bash
poetry run python server.py
```

3. Start the frontend server:
```bash
cd frontend
pnpm dev
```

The application will be available at `http://localhost:5173`.