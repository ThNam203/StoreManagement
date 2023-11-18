-- Role
INSERT IGNORE INTO staff_role (description, name, permission) VALUES ('Admin', 'ADMIN', 'ADMIN');
INSERT IGNORE INTO staff_role (description, name, permission) VALUES ('Staff', 'STAFF', 'STAFF');

-- Location
INSERT IGNORE INTO locations (name) VALUES ('Location 1'), ('Location 2');

-- Product brand
INSERT IGNORE INTO product_brand (name) VALUES ('Brand 1'), ('Brand 2');

-- Product group
INSERT IGNORE INTO product_group (name) VALUES ('Group 1'), ('Group 2');

-- Product property name
INSERT IGNORE INTO product_property_name (name) VALUES ('Property 1'), ('Property 2');