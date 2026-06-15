-- HiSUP 2.0 Database Triggers

-- ==========================================
-- UNIVERSAL AUDIT TRIGGER FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION trg_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (action, table_name, record_id, old_data)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD)::jsonb);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (action, table_name, record_id, old_data, new_data)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        -- Handled manually in Stored Procedures where user_id context is needed,
        -- but as a fallback:
        -- INSERT INTO audit_logs (action, table_name, record_id, new_data)
        -- VALUES ('INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW)::jsonb);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply Audit Triggers to Critical Tables (Example)
-- Note: Replace 'id' in trg_audit_log with the actual primary key name if generalizing,
-- or create specific functions for specific tables if primary keys differ.
-- Since PKs differ (e.g., student_id, payment_id), a more dynamic approach or specific triggers are needed.

-- ==========================================
-- SPECIFIC WORKFLOW TRIGGERS
-- ==========================================

-- Trigger to Recalculate CGPA when grades are updated
CREATE OR REPLACE FUNCTION trg_calculate_gpa()
RETURNS TRIGGER AS $$
DECLARE
    v_semester VARCHAR(20);
    v_total_points DECIMAL(10,2) := 0;
    v_total_credits INT := 0;
    v_semester_gpa DECIMAL(3,2);
    v_cgpa DECIMAL(3,2);
BEGIN
    -- Determine semester
    SELECT semester INTO v_semester FROM sections WHERE section_id = NEW.section_id;

    -- Calculate Semester GPA
    SELECT SUM(g.grade_points * c.credit_hours), SUM(c.credit_hours)
    INTO v_total_points, v_total_credits
    FROM grades g
    JOIN sections s ON g.section_id = s.section_id
    JOIN courses c ON s.course_id = c.course_id
    WHERE g.student_id = NEW.student_id AND s.semester = v_semester;

    IF v_total_credits > 0 THEN
        v_semester_gpa := v_total_points / v_total_credits;
    ELSE
        v_semester_gpa := 0.00;
    END IF;

    -- Calculate CGPA
    SELECT SUM(g.grade_points * c.credit_hours), SUM(c.credit_hours)
    INTO v_total_points, v_total_credits
    FROM grades g
    JOIN sections s ON g.section_id = s.section_id
    JOIN courses c ON s.course_id = c.course_id
    WHERE g.student_id = NEW.student_id;

    IF v_total_credits > 0 THEN
        v_cgpa := v_total_points / v_total_credits;
    ELSE
        v_cgpa := 0.00;
    END IF;

    -- Update or Insert Results
    INSERT INTO results (student_id, semester, semester_gpa, cgpa)
    VALUES (NEW.student_id, v_semester, v_semester_gpa, v_cgpa)
    ON CONFLICT (student_id, semester) 
    DO UPDATE SET semester_gpa = EXCLUDED.semester_gpa, cgpa = EXCLUDED.cgpa;

    -- Generate Notification
    INSERT INTO notifications (user_id, title, message)
    SELECT user_id, 'Result Updated', 'Your grades for ' || v_semester || ' have been updated.'
    FROM students WHERE student_id = NEW.student_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS grade_insert_trigger ON grades;
CREATE TRIGGER grade_insert_trigger
AFTER INSERT OR UPDATE ON grades
FOR EACH ROW
EXECUTE FUNCTION trg_calculate_gpa();
