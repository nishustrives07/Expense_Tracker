# AI_NOTES.md

# AI-Assisted Development Notes

This document describes how I used AI while completing this assignment and the engineering approach I followed throughout the development process.

Rather than treating AI as something that writes software for me, I used it as a development assistant to improve productivity while ensuring that the final implementation was something I understood, reviewed, tested, and was comfortable submitting.

---

# 1. How I Approached This Assignment

When I received this assignment, I didn't start writing code immediately.

I first read the problem statement carefully and noted down every requirement that needed to be implemented. I broke the assignment into smaller functional modules so that I could understand the overall workflow before writing any code.

The project was planned around:

- Expense CRUD operations
- Category filtering
- Expense summary calculation
- Input validation
- Local JSON file persistence
- Automated testing
- Documentation

Having previously worked on an expense management application during my internship, I already had a basic understanding of how such systems are generally structured. That experience helped me focus first on understanding the workflow and requirements before thinking about implementation.

Only after the overall structure was clear did I begin building the project.

---

# 2. How I Used AI

I used both **Claude** and **ChatGPT** during different stages of development.

### Claude

Claude was primarily used during implementation.

It helped me with:

- Generating the initial project structure.
- Creating the first version of the REST API.
- Suggesting validation logic.
- Assisting with automated test generation.
- Drafting the initial documentation.

Instead of treating the generated code as the final solution, I considered it the first implementation that still needed engineering review.

### ChatGPT

ChatGPT was mainly used during the review phase.

It helped me:

- Review the overall project from an engineering perspective.
- Improve the README and AI_NOTES documentation.
- Verify that the repository structure matched the assignment instructions.
- Improve the presentation and clarity of the final submission.
- Review the project as if it were being evaluated by a recruiter or engineering reviewer.

Using both Claude and ChatGPT gave me different perspectives during development, but every piece of code included in the final submission was reviewed by me. I only kept implementations that I understood, validated through testing, and was confident explaining.

---

# 3. What I Reviewed and Changed

After the initial implementation, I went through the project module by module instead of assuming the generated code was correct.

I reviewed:

- API routes
- Controller logic
- Validation rules
- Error handling
- JSON file persistence
- Response formats
- Test cases
- Folder structure
- Documentation

Wherever I identified opportunities for improvement, I updated the implementation to better align with the assignment requirements, improve readability, simplify the code where appropriate, and ensure I fully understood the logic before considering it complete.

---

# 4. Validation & Testing

Once the implementation was complete, I validated the project using both automated and manual testing.

The validation process included:

- Running the complete Jest and Supertest test suite.
- Testing API endpoints manually.
- Verifying request validation.
- Confirming expected HTTP status codes.
- Checking JSON data persistence.
- Verifying that the installation, server startup, and test commands documented in the README work correctly.

My objective wasn't simply to make the tests pass, but to ensure the application behaved correctly from the perspective of someone consuming the API.

---

# 5. AI Suggestions I Chose Not to Use

During development, AI suggested several ideas that would have made the project larger.

Some examples included:

- Database integration instead of local JSON storage.
- Authentication and authorization.
- Pagination.
- Additional features beyond the assignment requirements.

I intentionally chose not to implement these suggestions because the assignment specifically requested a lightweight REST API using local JSON storage.

Rather than adding unnecessary complexity, I preferred to stay aligned with the project requirements and focus on delivering a clean, complete implementation.

---

# 6. What I Learned

One thing this assignment reinforced for me is that AI can significantly improve development speed, but it does not replace understanding the problem.

The most valuable part of the process wasn't generating code—it was reviewing the implementation, understanding why it worked, validating the behaviour through testing, and making improvements wherever necessary.

For me, AI worked best as an engineering assistant rather than an engineering replacement.

If I get the opportunity to work at Diligent, this is the same workflow I would continue to follow:

- Understand the requirements before writing code.
- Break the problem into smaller modules.
- Design the solution before implementation.
- Use AI responsibly to improve productivity.
- Critically review AI-generated code instead of accepting it blindly.
- Validate every feature through testing.
- Deliver software that is clean, maintainable, and well documented.

This assignment was a good learning experience because it reinforced the importance of combining engineering judgement with modern AI-assisted development rather than relying on either one independently.
