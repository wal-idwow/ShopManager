### Tomorrow's 5-Hour Work Plan

**Total Work Time:** 4 hours
**Total Break Time:** 1 hour

---

#### **Hour 1: Setup & Critical Bug Fixes (60 mins)**

*   **To-Do:**
    1.  **Create a new branch** for your work. Name it something like `refactor/async-and-transactions`.
    2.  **Standardize Async/Await**: Go through `productController.js` and `transactionController.js`. Convert all remaining callback-based logic to use `async/await`. This will make the code much cleaner and easier to debug.
    3.  **Fix Controller-Model Mismatch**: In `transactionController.js`, identify the call to the non-existent `Transaction.updateProductQuantity` and correct it to use the right model method, or create the method if it's missing.

*   **Goal**: Stabilize the existing codebase by fixing the most critical bugs.

---

#### **Break (15 mins)**

*   *Stretch, grab a coffee, or step away from the screen.*

---

#### **Hour 2: Implement SQL Transactions (60 mins)**

*   **To-Do:**
    1.  **Focus on `transactionModel.js`**: Wrap the logic for creating a new transaction and updating the product's stock into a single database transaction using `db.transaction()`. This is the most critical data integrity issue to solve.
    2.  **Test the Transaction**: Manually test the process of creating a new transaction to ensure that both the transaction is recorded and the product stock is updated correctly. Try to create a scenario where the stock update might fail to ensure the transaction rolls back.

*   **Goal**: Ensure data integrity by making transaction and stock updates atomic.

---

#### **Break (15 mins)**

*   *A short break to refresh.*

---

#### **Hour 3: Frontend - State Management with React Query (60 mins)**

*   **To-Do:**
    1.  **Install React Query**: Add `react-query` to your frontend project.
        ```bash
        cd frontend
        npm install react-query
        ```
    2.  **Wrap Your App**: In `src/index.js` or `src/App.jsx`, wrap your application with the `QueryClientProvider`.
    3.  **Refactor Product List**: Convert the `ProductList.jsx` component to use the `useQuery` hook to fetch products instead of a `useEffect`. This will give you caching and automatic refetching.

*   **Goal**: Introduce a modern state management library to improve frontend performance and user experience.

---

#### **Break (30 mins)**

*   *Take a longer break to have a snack and rest your eyes.*

---

#### **Hour 4: Code Quality & Pull Request (60 mins)**

*   **To-Do:**
    1.  **Install & Configure Prettier**: Add Prettier to both your `frontend` and `backend` projects to automatically format your code. This will make the entire codebase more consistent.
    2.  **Run Prettier**: Run the formatter on all your files to clean up the code you've worked on today.
    3.  **Commit Your Changes**: Commit all the work you've done to your new branch.
    4.  **Open a Pull Request**: Push your branch to GitHub and open a Pull Request to merge it into `main`. Write a brief description of the changes you made.

*   **Goal**: Improve code quality and formally propose your changes for merging into the main branch.
