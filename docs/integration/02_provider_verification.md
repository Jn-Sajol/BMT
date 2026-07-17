# 02 Provider Verification — IV-01

## 1. Provider SDK Registry
*   `ProviderRegistry` acts as a centralized repository for dynamic platform integrations.
*   Resolving `meta-provider` returns standard authorization dialogs and graph clients.

## 2. Decoupled Graph Clients
*   All provider APIs inherit the generic `IGraphClient` signature, enabling mock client testing without core adjustments.
