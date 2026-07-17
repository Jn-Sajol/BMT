# 05 Runtime Verification — IV-01

## 1. BullMQ Worker Lifecycle
*   Workers process queued items from the `workflow-executions` queue using `processWorkflowJob`.
*   Concurrency settings allow up to 5 concurrent executions.

## 2. Shared Redis Pool
*   `RedisConnectionManager` controls reconnection retries.
*   SIGTERM handlers stop queue listeners and close connections gracefully.
