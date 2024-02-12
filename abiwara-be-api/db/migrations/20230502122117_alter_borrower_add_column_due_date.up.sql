ALTER TABLE borrowers RENAME COLUMN return_date TO due_date;
ALTER TABLE borrowers ADD COLUMN return_date date;
