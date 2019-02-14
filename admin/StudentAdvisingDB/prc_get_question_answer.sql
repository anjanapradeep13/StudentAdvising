USE advising_current_students;
set global max_allowed_packet=1024*1024*1024;

-- =============================================
-- Author:      Aastha Kumar
-- Create date:  Feb, 10, 2017
-- Description:  User SignIn Procedure
-- Version: 0.1
-- =============================================

DROP PROCEDURE IF EXISTS prc_select_question_answer;

DELIMITER $$
CREATE PROCEDURE prc_select_question_answer ()
BEGIN
		SELECT  CONCAT(
    '[', JSON_OBJECT(
			'question', CAST(question AS CHAR(10000) CHARACTER SET utf8),
			'answer', CAST(answer AS CHAR(10000) CHARACTER SET utf8),
			'category', c.category_name
		),
    ']') as result
		FROM Questions q inner join Answers a on q.answer_id = a.id
		inner join Categories c on c.id = q.category_id;

END $$

DELIMITER ;


