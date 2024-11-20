import logging
import os
from logging.handlers import RotatingFileHandler

APP_NAME = "TerraChat"
ROOT_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FMT = "%(asctime)s\t%(levelname)s\t%(name)s:%(lineno)d\t%(message)s"
DATE_FMT = "%Y-%m-%dT%H:%M:%S%z"
LOG_LEVEL = logging.INFO

logging.basicConfig(level=LOG_LEVEL, format=FMT, datefmt=DATE_FMT)
log = logging.getLogger(f"{APP_NAME}-logger")
log_path = os.path.join(ROOT_PATH, f"logs/{APP_NAME}.log")
os.makedirs(os.path.dirname(log_path), exist_ok=True)

# Create handlers
handler = RotatingFileHandler(log_path, maxBytes=7000000, backupCount=10)
handler.setLevel(LOG_LEVEL)

# Create formats and add it to handlers
formatter = logging.Formatter(fmt=FMT, datefmt=DATE_FMT)
handler.setFormatter(formatter)

# Add handlers to the logger
log.addHandler(handler)
