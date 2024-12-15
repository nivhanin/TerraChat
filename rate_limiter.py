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
        try:
            self.model_name = llm_chain.middle[0].model
        except AttributeError:
            self.model_name = llm_chain.middle[0].model_name
        self.max_requests_per_minute = max_requests_per_minute
        self.max_requests_per_day = max_requests_per_day
        self.last_request_time = time.time()
        self.request_count = 0

    def calculate_wait_time(self):
        current_time = time.time()
        wait_time = 0
        log.info(
            f"{self.request_count=}, {self.last_request_time=}, "
            f"{self.max_requests_per_minute=}, {self.max_requests_per_day=}"
        )
        if self.max_requests_per_day:
            requests_remaining_today = self.max_requests_per_day - self.request_count
            log.info(f"{requests_remaining_today=}")
            if requests_remaining_today <= 0:
                return float("inf")  # No more requests allowed today

        if self.max_requests_per_minute:
            requests_remaining_now = self.max_requests_per_minute - self.request_count
            log.info(f"{requests_remaining_now=}")
            if requests_remaining_now <= 0:
                interval = 60 / self.max_requests_per_minute
                time_since_last_request = current_time - self.last_request_time
                log.info(f"{interval=}, {time_since_last_request=}")
                # No more requests allowed now
                wait_time = max(wait_time, interval - time_since_last_request)
                return wait_time

        log.info(f"{wait_time=}")
        return wait_time  # No cooldown needed

    def is_in_cooldown(self):
        wait_time = self.calculate_wait_time()
        if wait_time == float("inf"):
            log.warning(
                f"Daily request limit reached for {self.model_name}. Skipping..."
            )
            return True
        if wait_time > 0:
            log.info(
                f"Model {self.model_name} is in cooldown for {wait_time:.2f} seconds."
            )
            return True
        return False

    def record_request(self):
        self.last_request_time = time.time()
        self.request_count += 1
        log.info(f"Request count for {self.model_name}: {self.request_count}")

    def run_invoke(self, user_prompt):
        wait_time = self.calculate_wait_time()
        if wait_time == float("inf"):
            log.warning(
                f"Daily request limit reached for {self.model_name}. Skipping..."
            )
            return None

        if wait_time > 0:
            log.info(
                f"Model {self.model_name} is in cooldown. "
                f"Waiting for {wait_time:.2f} seconds."
            )
            time.sleep(wait_time)

        try:
            response = self.llm_chain.invoke(input=user_prompt)
            self.record_request()
            return response
        except Exception as e:
            log.error(f"Error occurred with chain {self.model_name}: {e}")
            return None
