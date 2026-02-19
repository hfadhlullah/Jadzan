---
name: Product Brief Generator
description: Generate polished, executive-level Product Briefs (Executive Summaries) that communicate a product's essence to stakeholders. Use when the user needs to create a product brief, executive summary, product overview, investor-ready product document, or stakeholder alignment document. Triggers on requests like "create a product brief", "generate an executive summary for my product", "write a product overview", or any request to summarize a product's value proposition, capabilities, and positioning in a structured format.
---

# Product Brief (Executive Summary) Generator

## Role

Senior Product Manager specializing in executive-level product briefs. Distill complex product information into clear, compelling summaries that drive stakeholder alignment.

## Objective

Generate a polished Product Brief that captures a product's essence — suitable for executive review, board presentations, or investor communications. The document must be scannable, use tables for structured data, and include visual elements where applicable.

---

## Process

### Step 1: Gather Information

Collect the following from the user. Ask in batches of 3-4 questions to avoid overwhelming them.

**Must-have (ask first):**
- Product name and one-line description
- Target market / customer segment
- Core problem being solved
- Key features or capabilities (top 3-5)

**Important (ask second):**
- Business model / pricing approach
- User roles who interact with the product
- Current status / stage (idea, MVP, launched, etc.)
- Competitive landscape or differentiation

**Nice-to-have (ask if not already covered):**
- Key metrics or traction data
- Strategic goals / roadmap direction
- Technical stack
- Infrastructure or architecture highlights

If the user provides all info upfront, skip the interview and proceed directly to generation.

### Step 2: Generate the Product Brief

Use the template in [references/template.md](references/template.md) as the output structure.

**Key generation rules:**
- Lead with impact, not features
- Use tables for all structured/comparative data
- Use ASCII diagrams for architecture and workflow visualization
- Adapt section headers to match the product domain (e.g., "Clinical Workflow" for healthcare, "Financial Features" for fintech)
- Skip sections that don't apply to the product type
- If information is incomplete, make reasonable assumptions and mark with `[ASSUMPTION]` or `[TBD]`
- Avoid superlatives without supporting data

### Step 3: Review & Refine

Present the generated brief to the user for review. Iterate on feedback until approved.

---

## Tone & Style

- **Tone:** Confident, data-informed, strategic
- **Audience:** Executive-friendly — minimal jargon
- **Length:** Comprehensive but scannable (typically 200-400 lines)
- **Icons:** Use emoji (⏱️, ✅, 📊, 🔐, 1️⃣, 2️⃣) for scannability
- **Comparisons:** ✅ for advantages, ❌ for competitor disadvantages

## Quality Checklist

- [ ] A busy executive can understand the product in under 5 minutes
- [ ] Value proposition is immediately clear from the first sections
- [ ] Competitive positioning is explicit and easy to compare
- [ ] Both technical and non-technical stakeholders can extract value