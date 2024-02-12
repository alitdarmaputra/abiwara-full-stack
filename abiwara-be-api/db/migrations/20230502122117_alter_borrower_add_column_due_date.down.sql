ALTER TABLE borrowers RENAME COLUMN due_date return_date;
ALTER TABLE borrowers DROP COLUMN return_date;
