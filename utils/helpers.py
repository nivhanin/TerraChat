import os


def is_env_var_set(env_var):
    return os.getenv(env_var) is not None
