create table Iocs (
	id INT,
	url VARCHAR(1000),
	created_at DATE,
	updated_at DATE,
	removed_date DATE,
	status VARCHAR(255),
	report_method_one VARCHAR(255),
	report_method_two VARCHAR(255),
	form VARCHAR(255),
	host VARCHAR(255),
	follow_up_date DATE,
	follow_up_count INT,
	comments TEXT
);
