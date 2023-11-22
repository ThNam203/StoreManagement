-- Role
INSERT IGNORE INTO staff_role (description, name, permission) VALUES ('Admin', 'ADMIN', 'ADMIN');
INSERT IGNORE INTO staff_role (description, name, permission) VALUES ('Staff', 'STAFF', 'STAFF');

-- Location
INSERT IGNORE INTO locations (name) VALUES
('Produce Section'),
('Dairy Aisle'),
('Meat Department'),
('Bakery Corner'),
('Frozen Foods'),
('Canned Goods Aisle'),
('Snack Zone'),
('Beverage Isle'),
('Household Essentials'),
('Bulk Foods'),
('Deli Counter'),
('Seafood Section'),
('International Foods'),
('Organic Produce'),
('Gluten-Free Section'),
('Fresh Flowers'),
('Health and Wellness'),
('Baby Care'),
('Pet Supplies'),
('Bread Shelf'),
('Condiments Aisle');

-- Product brand
INSERT IGNORE INTO product_brand (name) VALUES
('FreshFarms'),
('GreatHarvest'),
('HappyHarvest'),
('PureDelight'),
('NatureNourish'),
('OceanHarbor'),
('GoldenGrains'),
('EvergreenOrganics'),
('PrimeMeats'),
('HappyHens'),
('DeliDelights'),
('ChillChill'),
('SweetTreats'),
('MightyMunchies'),
('SipSip'),
('HomeHarvest'),
('SunriseBakery'),
('WholesomeWonders'),
('GreenGroves'),
('SunnySideUp'),
('WellnessWays'),
('FlourishFoods'),
('PetPalace'),
('TinyToes'),
('EverydayEssentials'),
('FloralFantasy');

-- Product group
INSERT IGNORE INTO product_group (name) VALUES
('Fruits'),
('Vegetables'),
('Dairy Products'),
('Bakery Items'),
('Frozen Foods'),
('Canned Goods'),
('Snacks'),
('Beverages'),
('Household Essentials'),
('Bulk Foods'),
('Meat'),
('Seafood'),
('International Foods'),
('Organic Products'),
('Gluten-Free Products'),
('Fresh Flowers'),
('Health and Wellness'),
('Baby Care'),
('Pet Supplies'),
('Bread'),
('Condiments'),
('Sweets and Treats');


-- Product property name
INSERT IGNORE INTO product_property_name (name) VALUES
('Color'),
('Weight'),
('Size'),
('Calories'),
('Nutritional Information'),
('Ingredients'),
('Brand'),
('Expiration Date'),
('Country of Origin'),
('Allergens'),
('Dietary Information'),
('Volume'),
('Material'),
('Shelf Life'),
('Temperature Requirements'),
('Serving Size'),
('Packaging Type'),
('Certifications'),
('Protein Content'),
('Fat Content'),
('Carbohydrate Content'),
('Fiber Content'),
('Sodium Content'),
('Vitamin Content'),
('Mineral Content');

-- Customer Group
INSERT IGNORE INTO customer_group (name) VALUES
('Regular'),
('Senior Citizen'),
('Student'),
('Employee'),
('VIP');
