# Workflow models

Choose the first applicable model in the table's priority order. This resolves conflicting signals while allowing justified adjustments for the context.

| Priority and model | When to use | Stage rhythm | Changes and progression |
|--------------------|-------------|--------------|-------------------------|
| **1. Formal methods** | There are regulatory, certification, or formal-proof obligations | Specify before building and tie verification evidence to relevant changes | Advance when the evidence and applicable obligations are satisfied. Do not claim certification without evidence. |
| **2. Spiral (risk-driven)** | There is high technical risk or several significant unknowns | Repeat risk analysis, planning, architecture, building, and verification in cycles | Address the highest risk first. Move to delivery when the remaining risk is accepted. |
| **3. Prototyping** | The solution's feasibility is unknown | Repeat research, architecture, building, and verification until there is evidence of feasibility | Discard the prototype. Stop when the question is answered, or plan production as separate work. |
| **4. Incremental** | The scope is expected to evolve or delivery can be split into useful slices | Research and plan the start; repeat building, verification, and delivery for each slice, including architecture when needed | Put new changes into future slices. Check each slice before starting the next. |
| **5. Cascade** | Requirements are stable, with low uncertainty and risk | Move once through research, planning, architecture, building, verification, and delivery | Require approval between stages. A material change reopens planning. |

The chosen model guides the cycle but does not change the shared handoff protocol: each delegated task has an objective, inputs, acceptance criteria, expected output, and limits. Check and accept each stage's artifact before advancing. Adjust the rhythm when the context justifies it and record why in the accepted-state summary.
