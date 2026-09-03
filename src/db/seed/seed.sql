-- CodeFlow seed data. Applied via:
--   wrangler d1 execute codeflow-db --remote --file=src/db/seed/seed.sql

-- Weekly schedule (Phase 6 requirement: comes from DB, editable by admin)
INSERT OR IGNORE INTO schedule (id, day_of_week, subject, description) VALUES
  ('sch-1', 1, 'HTML', 'Dasar-dasar struktur halaman web'),
  ('sch-2', 2, 'CSS', 'Styling dan layout'),
  ('sch-3', 3, 'JavaScript', 'Logika dan interaktivitas'),
  ('sch-4', 4, 'Python', 'Bahasa serbaguna untuk pemula'),
  ('sch-5', 5, 'Database & SQL', 'Menyimpan dan mengambil data'),
  ('sch-6', 6, 'Project Day', 'Menerapkan apa yang sudah dipelajari'),
  ('sch-0', 0, 'Review & Challenge', 'Mengulang dan menguji pemahaman');

-- Achievements
INSERT OR IGNORE INTO achievements (code, title, description) VALUES
  ('FIRST_STEP', 'First Step', 'First lesson completed'),
  ('CODE_RUNNER', 'Code Runner', 'Complete 10 challenges'),
  ('WEEK_WARRIOR', 'Week Warrior', '7 day streak'),
  ('QUIZ_MASTER', 'Quiz Master', 'Score high on quizzes');

-- Course + module + lessons
INSERT OR IGNORE INTO courses (id, title, slug, description, difficulty, category, estimated_duration, published, order_index)
VALUES ('course-js-basics', 'JavaScript Basics', 'javascript-basics', 'Dasar-dasar JavaScript untuk pemula', 'Easy', 'JavaScript', '2 jam', 1, 1);

INSERT OR IGNORE INTO course_modules (id, course_id, title, order_index)
VALUES ('module-js-1', 'course-js-basics', 'Pengenalan JavaScript', 1);

INSERT OR IGNORE INTO lessons (id, module_id, title, slug, content, difficulty, xp_reward, estimated_minutes, published, order_index)
VALUES
  ('lesson-js-1', 'module-js-1', 'Variabel & Tipe Data', 'variabel-tipe-data',
   'Gunakan let untuk variabel yang bisa berubah, const untuk yang tetap. Tipe data dasar: string, number, boolean, object, array.',
   'Easy', 25, 15, 1, 1),
  ('lesson-js-2', 'module-js-1', 'Function & Scope', 'function-scope',
   'Function adalah blok kode yang bisa dipanggil ulang. Scope menentukan di mana variabel bisa diakses.',
   'Medium', 30, 15, 1, 2);

-- Roadmap
INSERT OR IGNORE INTO roadmaps (id, title, slug, description) VALUES
  ('roadmap-frontend', 'Frontend Developer', 'frontend', 'Jalur belajar menjadi Frontend Developer'),
  ('roadmap-backend', 'Backend Developer', 'backend', 'Jalur belajar menjadi Backend Developer'),
  ('roadmap-fullstack', 'Full-Stack Developer', 'fullstack', 'Jalur belajar Full-Stack'),
  ('roadmap-mobile', 'Mobile Developer', 'mobile', 'Jalur belajar Mobile Development'),
  ('roadmap-ai', 'AI Developer', 'ai', 'Jalur belajar AI/ML'),
  ('roadmap-devops', 'DevOps Engineer', 'devops', 'Jalur belajar DevOps'),
  ('roadmap-cybersecurity', 'Cybersecurity', 'cybersecurity', 'Jalur belajar Cybersecurity'),
  ('roadmap-game', 'Game Developer', 'game', 'Jalur belajar Game Development');

INSERT OR IGNORE INTO roadmap_items (id, roadmap_id, title, order_index) VALUES
  ('fe-html', 'roadmap-frontend', 'HTML', 1),
  ('fe-css', 'roadmap-frontend', 'CSS', 2),
  ('fe-js', 'roadmap-frontend', 'JavaScript', 3),
  ('fe-git', 'roadmap-frontend', 'Git', 4),
  ('fe-react', 'roadmap-frontend', 'React', 5);

-- Challenge
INSERT OR IGNORE INTO challenges (id, title, slug, description, difficulty, language, instructions, examples, hints, solution, xp_reward, published)
VALUES ('challenge-fizzbuzz', 'FizzBuzz', 'fizzbuzz',
  'Cetak angka 1-100, tapi kelipatan 3 cetak Fizz, kelipatan 5 cetak Buzz, kelipatan keduanya cetak FizzBuzz.',
  'Easy', 'javascript',
  'Gunakan loop dari 1 sampai 100 dan modulo operator.',
  '3 => Fizz, 5 => Buzz, 15 => FizzBuzz',
  'Cek kelipatan 15 duluan sebelum cek 3 dan 5 secara terpisah.',
  'for (let i=1;i<=100;i++){ if(i%15===0) console.log("FizzBuzz"); else if(i%3===0) console.log("Fizz"); else if(i%5===0) console.log("Buzz"); else console.log(i); }',
  30, 1);

-- Quiz + questions
INSERT OR IGNORE INTO quizzes (id, title, category) VALUES ('quiz-js', 'JavaScript Quiz', 'javascript');

INSERT OR IGNORE INTO quiz_questions (id, quiz_id, question, options, correct_answer, explanation, difficulty, xp_reward)
VALUES
  ('q-js-1', 'quiz-js', 'Apa fungsi console.log() pada JavaScript?',
   '["Membuat variable","Menampilkan output","Menghapus variable","Membuat function"]', '1',
   'console.log() menampilkan output ke console.', 'Easy', 10),
  ('q-js-2', 'quiz-js', 'Keyword mana yang membuat variabel tidak bisa diubah?',
   '["let","var","const","static"]', '2',
   'const membuat binding yang tidak bisa di-reassign.', 'Easy', 10);

-- Project
INSERT OR IGNORE INTO projects (id, title, slug, description, difficulty, xp_reward) VALUES
  ('proj-todo', 'Todo List App', 'todo-list-app', 'Bangun aplikasi todo list sederhana.', 'Easy', 200),
  ('proj-weather', 'Weather App', 'weather-app', 'Bangun aplikasi cuaca menggunakan API publik.', 'Medium', 250);

-- Article
INSERT OR IGNORE INTO articles (id, title, slug, summary, content, published) VALUES
  ('article-js-array', 'Memahami Array di JavaScript', 'javascript-array',
   'Pengenalan dasar array dan method-method umum di JavaScript.',
   'Array di JavaScript adalah struktur data yang menyimpan banyak nilai dalam satu variabel...',
   1);
