# 🚀 Boozebunk
**Revolutionize liquor discovery! Instantly connect customers to nearby, in-stock brands while empowering mart owners to easily manage their stock.**

This project is a comprehensive full-stack web application designed to streamline the liquor retail experience for customers, vendors, and administrators.

---

## 🛠️ Tech Stack

This project is built with a modern, high-performance, and scalable technology stack:

* **Frontend:** [Next.js]
* **Backend Runtime:** [Bun.js]
* **Backend Framework:** [Fastify]
* **API Layer:** [tRPC]
* **ORM:** [Drizzle ORM]
* **Database:** [PostgreSQL]
    * **Geospatial Extension:** [PostGIS]
* **Authentication:** [BetterAuth]
* **Email Services:** [AWS SES (Simple Email Service)]
* **Email Validation:** [Mailgun Email Validation API]
* **Location Data:** [Google Places API]
* **Website Analytics:** [Google Analytics 4 (GA4)] & [Google Analytics Data API]

---

## 🏁 Getting Started (Local Development)

To set up the project locally for development, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone 
    ```
2.  **Install Bun:** Ensure Bun is installed on your system.
    ```bash
    npm install -g bun
    ```
3.  **Install Dependencies:**
    ```bash
    bun install
    ```
4.  **Start Project:**
    ```bash
    bun dev
    ```

## 📁 Frontend File Structure

```
frontend/
  └─ next/
      ├─ src/
      │   ├─ app/
      │   ├─ hooks/
      │   ├─ providers/
      │   ├─ shared/
      │   ├─ styles/
      │   ├─ utils/
      │   └─ env.ts
      ├─ public/
      ├─ package.json
      ├─ tsconfig.json
      ├─ next.config.ts
      ├─ postcss.config.mjs
      ├─ prettier.config.mjs
      ├─ eslint.config.mjs
      └─ ...
```

## 📁 Backend File Structure

```
backend/
  └─ trpc/
      ├─ src/
      │   ├─ db/
      │   │   ├─ schema/
      │   │   ├─ migrations/
      │   │   ├─ index.ts
      │   │   └─ migrate.ts
      │   ├─ modules/
      │   ├─ server/
      │   ├─ config/
      │   ├─ env.ts
      │   ├─ fastify.ts
      │   ├─ main.ts
      ├─ package.json
      ├─ tsconfig.json
      ├─ drizzle.config.ts
      ├─ postcss.config.mjs
      ├─ prettier.config.mjs
      ├─ eslint.config.mjs
      └─ ...
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---