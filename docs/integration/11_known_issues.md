# 11 Known Issues — IV-01

The following issues are catalogued for post-v1 resolution:

*   **OAuth Callback Pathing:** Changing workspace route ids resets initial OAuth dialog parameters (mitigated by storing workspace target state in OAuth state parameters).
*   **BullMQ Redis connection failovers:** Temporary DNS resolution delays on Redis clusters can cause workers to disconnect (mitigated by configuring auto-reconnect strategy retries).
