import time
from utils.logger import log


class RateLimiterLLMChain:
    def __init__(
        self,
        llm_chain,
        max_requests_per_minute=None,
        max_requests_per_day=None,
    ):
        self.llm_chain = llm_chain
        self.model_name = llm_chain.middle[0].model
        self.max_requests_per_minute = max_requests_per_minute
        self.max_requests_per_day = max_requests_per_day
        self.last_request_time = time.time()
        self.request_count = 0

    def calculate_wait_time(self):
        current_time = time.time()
        wait_time = 0

        if self.max_requests_per_minute:
            interval = 60 / self.max_requests_per_minute
            time_since_last_request = current_time - self.last_request_time
            if time_since_last_request < interval:
                wait_time = interval - time_since_last_request

        if self.max_requests_per_day:
            requests_allowed_today = self.max_requests_per_day - self.request_count
            if requests_allowed_today <= 0:
                wait_time = float("inf")  # No more requests allowed today

        return wait_time

    def record_request(self):
        self.last_request_time = time.time()
        self.request_count += 1

    def run_invoke(self, user_prompt):
        wait_time = self.calculate_wait_time()
        if wait_time == float("inf"):
            log.warning(
                f"Daily request limit reached for {self.model_name}. Skipping..."
            )
            return None

        if wait_time > 0:
            log.info(
                f"Waiting for {wait_time:.2f} seconds before invoking "
                f"{self.model_name}..."
            )
            time.sleep(wait_time)

        try:
            response = self.llm_chain.invoke(input=user_prompt)
            self.record_request()
            return response
        except Exception as e:
            log.error(f"Error occurred with chain {self.model_name}: {e}")
            return None
