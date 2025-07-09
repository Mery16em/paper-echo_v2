-- Note: This script should be run after you have created a user account
-- Replace the user_id values with your actual user ID from auth.users

-- Insert sample books (you'll need to replace the user_id with actual user ID)
-- INSERT INTO books (title, author, cover_url, user_id) VALUES
-- ('The Great Gatsby', 'F. Scott Fitzgerald', 'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg', 'your-user-id-here'),
-- ('To Kill a Mockingbird', 'Harper Lee', 'https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg', 'your-user-id-here'),
-- ('1984', 'George Orwell', 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg', 'your-user-id-here');

-- Insert sample quotes (you'll need to replace the book_id and user_id with actual IDs)
-- INSERT INTO quotes (book_id, text, tags, user_id) VALUES
-- ('book-id-1', 'So we beat on, boats against the current, borne back ceaselessly into the past.', ARRAY['hope', 'perseverance', 'time'], 'your-user-id-here'),
-- ('book-id-2', 'You never really understand a person until you consider things from his point of view.', ARRAY['empathy', 'understanding', 'perspective'], 'your-user-id-here'),
-- ('book-id-3', 'Big Brother is watching you.', ARRAY['surveillance', 'control', 'dystopia'], 'your-user-id-here');
