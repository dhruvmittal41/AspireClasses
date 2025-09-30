exports.shorthands = undefined;

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
    // ## 1. Tests Table
    // This table is created first as the 'users' table references it.
    pgm.createTable("tests", {
        id: "id", // Creates a SERIAL PRIMARY KEY
        test_name: { type: "varchar(255)", notNull: true },
        num_questions: { type: "integer" },
        duration_minutes: { type: "integer" },
        subject_topic: { type: "text" },
        instructions: { type: "text" },
        test_category: { type: "varchar(100)" },
        date_scheduled: { type: "timestamp with time zone" },
        created_at: {
            type: "timestamp with time zone",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });

    // ## 2. Users Table
    pgm.createTable("users", {
        id: "id",
        full_name: { type: "varchar(255)", notNull: true },
        email_or_phone: { type: "varchar(255)", notNull: true, unique: true },
        school_name: { type: "varchar(255)" },
        is_paid: { type: "boolean", notNull: true, default: false },
        assigned_testid: {
            type: "integer",
            references: '"tests"', // Foreign key to the tests table
            onDelete: "SET NULL", // If a test is deleted, set this field to NULL
        },
        created_at: {
            type: "timestamp with time zone",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });

    // ## 3. Questions Table
    pgm.createTable("questions", {
        id: "id",
        test_id: {
            type: "integer",
            notNull: true,
            references: '"tests"', // Foreign key to the tests table
            onDelete: "CASCADE", // If a test is deleted, all its questions are deleted
        },
        question_text: { type: "text", notNull: true },
        options: { type: "jsonb", notNull: true },
        correct_option: { type: "varchar(255)", notNull: true },
        marks: { type: "integer", notNull: true, default: 1 },
        image_url: { type: "varchar(255)" },
    });

    // ## 4. Results Table
    pgm.createTable("results", {
        id: "id",
        user_id: {
            type: "integer",
            notNull: true,
            references: '"users"', // Foreign key to the users table
            onDelete: "CASCADE", // If a user is deleted, their results are also deleted
        },
        test_id: {
            type: "integer",
            notNull: true,
            references: '"tests"', // Foreign key to the tests table
            onDelete: "CASCADE",
        },
        score: { type: "integer", notNull: true },
        highest_score: { type: "integer" }, // Nullable by default
        submitted_at: {
            type: "timestamp with time zone",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
    // Drop tables in the reverse order of creation due to foreign key constraints
    pgm.dropTable("results");
    pgm.dropTable("questions");
    pgm.dropTable("users");
    pgm.dropTable("tests");
};