# 04 Execution Engine Verification — IV-01

## 1. Topological Traversal
*   Kahn's algorithm detects cyclic dependencies in the graph before execution starts.
*   Topologically sorted nodes run sequentially, transferring outputs between parent and child nodes.

## 2. Context Scope Evaluations
*   ExecutionContext parses template brackets dynamically (e.g., `{{node-1.output.id}}`).
