package com.springboot.store.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.store.entity.*;
import com.springboot.store.exception.CustomException;
import com.springboot.store.payload.StaffResponse;
import com.springboot.store.repository.*;
import com.springboot.store.service.JwtService;
import com.springboot.store.service.StaffPositionService;
import com.springboot.store.service.StaffService;
import com.springboot.store.utils.Role;
import com.springboot.store.utils.TokenType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final StaffService staffService;
    private final JwtService jwtService;
    private final StaffRepository staffRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final StaffRoleRepository staffRoleRepository;
    private final StoreRepository storeRepository;
    private final LocationRepository locationRepository;
    private final ProductBrandRepository productBrandRepository;
    private final ProductGroupRepository productGroupRepository;
    private final ProductPropertyNameRepository productPropertyNameRepository;
    private final CustomerGroupRepository customerGroupRepository;
    private final SupplierGroupRepository supplierGroupRepository;
    private final StaffPositionRepository staffPositionRepository;
    private final ViolationAndRewardRepository violationAndRewardRepository;


    public StaffResponse register(RegisterRequest request, HttpServletResponse response) {

        if (staffRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already in use", HttpStatus.BAD_REQUEST);
        }


        Store store = storeRepository.save(Store.builder()
                .name("Store of " + request.getName())
                .build());
        createDefaultData(store);

        var role = staffRoleRepository.findByNameAndStoreId(Role.OWNER, store.getId()).orElseThrow();
        Staff staff = new Staff();
        staff.setName(request.getName());
        staff.setEmail(request.getEmail());
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setStaffRole(role);
        staff.setStore(store);

        StaffPosition staffPosition = staffPositionRepository.findByNameAndStoreId("Owner", store.getId()).orElseThrow();
        staff.setStaffPosition(staffPosition);
        staffRepository.save(staff);

        store.setOwner(staff);
        storeRepository.save(store);


        var jwtToken = jwtService.generateToken(staff);
        var refreshToken = jwtService.generateRefreshToken(staff);
        saveUserToken(staff, refreshToken);

        ResponseCookie cookie = jwtService.generateCookie(jwtToken);
        ResponseCookie refreshCookie = jwtService.generateRefreshCookie(refreshToken);

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());


        return StaffResponse.builder()
                .id(staff.getId())
                .name(staff.getName())
                .email(staff.getEmail())
                .role(staff.getStaffRole().getName())
                .build();
    }

    public StaffResponse authenticate(
            AuthenticationRequest request,
            HttpServletResponse response) {
        // check email and password
        var user = staffRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException("Invalid username/password supplied", HttpStatus.UNPROCESSABLE_ENTITY));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException("Invalid username/password supplied.", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, refreshToken);

        ResponseCookie cookie = jwtService.generateCookie(jwtToken);
        ResponseCookie refreshCookie = jwtService.generateRefreshCookie(refreshToken);

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return staffService.getStaffById(user.getId());
    }

    private void saveUserToken(Staff user, String jwtToken) {
        var token = Token.builder()
                .staff(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(Staff user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.deleteAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
//        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
//            return;
//        }
//        refreshToken = authHeader.substring(7);

        // get the token from cookie
        refreshToken = jwtService.getJwtRefreshFromCookie(request);
        if (refreshToken == null || refreshToken.isEmpty()) {
            return;
        }

        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.staffRepository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)
                    && !jwtService.isRefreshTokenRevoked(refreshToken)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, refreshToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
//                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);

                // set the new access token in the cookie and body response
                var cookie = jwtService.generateCookie(authResponse.getAccessToken());
                response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
                response.getWriter().write(new ObjectMapper().writeValueAsString("Refreshed token successfully"));
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                // redirect to login page
                response.sendRedirect("http://localhost:3000/login");
            }
        }
    }

    private void createDefaultData(Store store) {
        // TODO: create default staff roles
        List<StaffRole> staffRoles = List.of(
                StaffRole.builder()
                        .name(Role.OWNER)
                        .store(store)
                        .build(),
                StaffRole.builder()
                        .name(Role.ADMIN)
                        .store(store)
                        .build(),
                StaffRole.builder()
                        .name(Role.MANAGER)
                        .store(store)
                        .build(),
                StaffRole.builder()
                        .name(Role.STAFF)
                        .store(store)
                        .build()
        );
        staffRoleRepository.saveAll(staffRoles);

        // TODO: create default location (store)
        List<Location> locations = List.of(
                Location.builder().name("Produce Section").store(store).build(),
                Location.builder().name("Dairy Aisle").store(store).build(),
                Location.builder().name("Meat Department").store(store).build(),
                Location.builder().name("Bakery Corner").store(store).build(),
                Location.builder().name("Frozen Foods").store(store).build(),
                Location.builder().name("Canned Goods Aisle").store(store).build(),
                Location.builder().name("Snack Zone").store(store).build(),
                Location.builder().name("Beverage Isle").store(store).build(),
                Location.builder().name("Household Essentials").store(store).build(),
                Location.builder().name("Bulk Foods").store(store).build(),
                Location.builder().name("Deli Counter").store(store).build(),
                Location.builder().name("Seafood Section").store(store).build(),
                Location.builder().name("International Foods").store(store).build(),
                Location.builder().name("Organic Produce").store(store).build(),
                Location.builder().name("Gluten-Free Section").store(store).build(),
                Location.builder().name("Fresh Flowers").store(store).build(),
                Location.builder().name("Health and Wellness").store(store).build(),
                Location.builder().name("Baby Care").store(store).build(),
                Location.builder().name("Pet Supplies").store(store).build(),
                Location.builder().name("Bread Shelf").store(store).build(),
                Location.builder().name("Condiments Aisle").store(store).build()
        );
        locationRepository.saveAll(locations);

        // TODO: create default products brands
        List<ProductBrand> productBrands = List.of(
                ProductBrand.builder().name("FreshFarms").store(store).build(),
                ProductBrand.builder().name("GreatHarvest").store(store).build(),
                ProductBrand.builder().name("HappyHarvest").store(store).build(),
                ProductBrand.builder().name("PureDelight").store(store).build(),
                ProductBrand.builder().name("NatureNourish").store(store).build(),
                ProductBrand.builder().name("OceanHarbor").store(store).build(),
                ProductBrand.builder().name("GoldenGrains").store(store).build(),
                ProductBrand.builder().name("EvergreenOrganics").store(store).build(),
                ProductBrand.builder().name("PrimeMeats").store(store).build(),
                ProductBrand.builder().name("HappyHens").store(store).build(),
                ProductBrand.builder().name("DeliDelights").store(store).build(),
                ProductBrand.builder().name("ChillChill").store(store).build(),
                ProductBrand.builder().name("SweetTreats").store(store).build(),
                ProductBrand.builder().name("MightyMunchies").store(store).build(),
                ProductBrand.builder().name("SipSip").store(store).build(),
                ProductBrand.builder().name("HomeHarvest").store(store).build(),
                ProductBrand.builder().name("SunriseBakery").store(store).build(),
                ProductBrand.builder().name("WholesomeWonders").store(store).build(),
                ProductBrand.builder().name("GreenGroves").store(store).build(),
                ProductBrand.builder().name("SunnySideUp").store(store).build(),
                ProductBrand.builder().name("WellnessWays").store(store).build(),
                ProductBrand.builder().name("FlourishFoods").store(store).build(),
                ProductBrand.builder().name("PetPalace").store(store).build(),
                ProductBrand.builder().name("TinyToes").store(store).build(),
                ProductBrand.builder().name("EverydayEssentials").store(store).build(),
                ProductBrand.builder().name("FloralFantasy").store(store).build()
        );
        productBrandRepository.saveAll(productBrands);

        // TODO: create default product groups
        List<ProductGroup> productGroups = List.of(
                ProductGroup.builder().name("Fruits").store(store).build(),
                ProductGroup.builder().name("Vegetables").store(store).build(),
                ProductGroup.builder().name("Dairy Products").store(store).build(),
                ProductGroup.builder().name("Bakery Items").store(store).build(),
                ProductGroup.builder().name("Frozen Foods").store(store).build(),
                ProductGroup.builder().name("Canned Goods").store(store).build(),
                ProductGroup.builder().name("Snacks").store(store).build(),
                ProductGroup.builder().name("Beverages").store(store).build(),
                ProductGroup.builder().name("Household Essentials").store(store).build(),
                ProductGroup.builder().name("Bulk Foods").store(store).build(),
                ProductGroup.builder().name("Meat").store(store).build(),
                ProductGroup.builder().name("Seafood").store(store).build(),
                ProductGroup.builder().name("International Foods").store(store).build(),
                ProductGroup.builder().name("Organic Products").store(store).build(),
                ProductGroup.builder().name("Gluten-Free Products").store(store).build(),
                ProductGroup.builder().name("Fresh Flowers").store(store).build(),
                ProductGroup.builder().name("Health and Wellness").store(store).build(),
                ProductGroup.builder().name("Baby Care").store(store).build(),
                ProductGroup.builder().name("Pet Supplies").store(store).build(),
                ProductGroup.builder().name("Bread").store(store).build(),
                ProductGroup.builder().name("Condiments").store(store).build(),
                ProductGroup.builder().name("Sweets and Treats").store(store).build()
        );
        productGroupRepository.saveAll(productGroups);

        // TODO: create default product property name
        List<ProductPropertyName> productPropertyNames = List.of(
                ProductPropertyName.builder().name("Color").store(store).build(),
                ProductPropertyName.builder().name("Weight").store(store).build(),
                ProductPropertyName.builder().name("Size").store(store).build(),
                ProductPropertyName.builder().name("Calories").store(store).build(),
                ProductPropertyName.builder().name("Nutritional Information").store(store).build(),
                ProductPropertyName.builder().name("Ingredients").store(store).build(),
                ProductPropertyName.builder().name("Brand").store(store).build(),
                ProductPropertyName.builder().name("Expiration Date").store(store).build(),
                ProductPropertyName.builder().name("Country of Origin").store(store).build(),
                ProductPropertyName.builder().name("Allergens").store(store).build(),
                ProductPropertyName.builder().name("Dietary Information").store(store).build(),
                ProductPropertyName.builder().name("Volume").store(store).build(),
                ProductPropertyName.builder().name("Material").store(store).build(),
                ProductPropertyName.builder().name("Shelf Life").store(store).build(),
                ProductPropertyName.builder().name("Temperature Requirements").store(store).build(),
                ProductPropertyName.builder().name("Serving Size").store(store).build(),
                ProductPropertyName.builder().name("Packaging Type").store(store).build(),
                ProductPropertyName.builder().name("Certifications").store(store).build(),
                ProductPropertyName.builder().name("Protein Content").store(store).build(),
                ProductPropertyName.builder().name("Fat Content").store(store).build(),
                ProductPropertyName.builder().name("Carbohydrate Content").store(store).build(),
                ProductPropertyName.builder().name("Fiber Content").store(store).build(),
                ProductPropertyName.builder().name("Sodium Content").store(store).build(),
                ProductPropertyName.builder().name("Vitamin Content").store(store).build(),
                ProductPropertyName.builder().name("Mineral Content").store(store).build()
        );
        productPropertyNameRepository.saveAll(productPropertyNames);

        // TODO: create default customer groups
        List<CustomerGroup> customerGroups = List.of(
                CustomerGroup.builder().name("VIP").store(store).build(),
                CustomerGroup.builder().name("Regular").store(store).build(),
                CustomerGroup.builder().name("Student").store(store).build(),
                CustomerGroup.builder().name("Inactive").store(store).build()
        );
        customerGroupRepository.saveAll(customerGroups);
        // TODO: create default staff positions
        List<StaffPosition> staffPositions = List.of(
                StaffPosition.builder()
                        .name("Owner")
                        .roleSetting(roleForOwner(store))
                        .store(store)
                        .build(),
                StaffPosition.builder()
                        .name("Manager")
                        .roleSetting(roleForManager(store))
                        .store(store)
                        .build(),
                StaffPosition.builder()
                        .name("Cashier")
                        .roleSetting(roleForCashier(store))
                        .store(store)
                        .build(),
                StaffPosition.builder()
                        .name("Guard")
                        .roleSetting(roleForGuard(store))
                        .store(store)
                        .build(),
                StaffPosition.builder()
                        .name("Warehouse Keeper")
                        .roleSetting(roleForWarehouseKeeper(store))
                        .store(store)
                        .build()
        );
        staffPositionRepository.saveAll(staffPositions);

        // TODO: create default supplier groups
        List<SupplierGroup> supplierGroups = List.of(
                SupplierGroup.builder().name("Provisions Alliance").store(store).build(),
                SupplierGroup.builder().name("Grocery Network Partners").store(store).build(),
                SupplierGroup.builder().name("Food Supply Collective").store(store).build(),
                SupplierGroup.builder().name("Pantry Consortium").store(store).build(),
                SupplierGroup.builder().name("Culinary Connections Group").store(store).build(),
                SupplierGroup.builder().name("Harvest Collaborative").store(store).build(),
                SupplierGroup.builder().name("Gourmet Goods Coalition").store(store).build(),
                SupplierGroup.builder().name("Nourish Network").store(store).build(),
                SupplierGroup.builder().name("Kitchen Essentials Collective").store(store).build(),
                SupplierGroup.builder().name("Grocer's Guild").store(store).build(),
                SupplierGroup.builder().name("Sustainable Sourcing Consortium").store(store).build(),
                SupplierGroup.builder().name("Culinary Comrades").store(store).build(),
                SupplierGroup.builder().name("Fresh Fare Federation").store(store).build(),
                SupplierGroup.builder().name("Market Maven Alliance").store(store).build(),
                SupplierGroup.builder().name("Epicurean Exchange Group").store(store).build()
        );
        supplierGroupRepository.saveAll(supplierGroups);

        // TODO: create default bonus and punish
        List<ViolationAndReward> violationAndRewards = List.of(
                ViolationAndReward.builder().name("Go to work late").type("Punish").defaultValue(100000).store(store).build(),
                ViolationAndReward.builder().name("Early leave").type("Punish").defaultValue(100000).store(store).build(),
                ViolationAndReward.builder().name("Unexcused absence").type("Punish").defaultValue(100000).store(store).build(),
                ViolationAndReward.builder().name("Good attitude").type("Bonus").defaultValue(100000).store(store).build(),
                ViolationAndReward.builder().name("Good performance").type("Bonus").defaultValue(100000).store(store).build()
        );
        violationAndRewardRepository.saveAll(violationAndRewards);

    }

    private RoleSetting roleForOwner(Store store) {
        return RoleSetting.builder()
                .overview(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .catalog(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .discount(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .stockCheck(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .invoice(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .returnInvoice(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .purchaseOrder(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .purchaseReturn(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .damageItems(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .fundLedger(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .customer(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .supplier(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .report(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .staff(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .attendance(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .store(store)
                .build();
    }
    private RoleSetting roleForManager(Store store) {
        return RoleSetting.builder()
                .overview(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .catalog(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .discount(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .stockCheck(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .invoice(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .returnInvoice(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .purchaseOrder(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .purchaseReturn(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .damageItems(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .fundLedger(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .customer(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .supplier(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .report(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .staff(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .attendance(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .store(store)
                .build();
    }
    private RoleSetting roleForCashier(Store store) {
        return RoleSetting.builder()
                .overview(RolePermission.builder().read(true).create(false).update(false).delete(false).export(true).build())
                .catalog(RolePermission.builder().read(true).create(true).update(true).delete(true).export(true).build())
                .discount(RolePermission.builder().read(true).create(false).update(false).delete(false).export(false).build())
                .stockCheck(RolePermission.builder().read(false).create(false).update(false).delete(false).export(true).build())
                .invoice(RolePermission.builder().read(true).create(true).update(false).delete(false).export(true).build())
                .returnInvoice(RolePermission.builder().read(true).create(true).update(false).delete(false).export(true).build())
                .purchaseOrder(RolePermission.builder().read(false).create(false).update(false).delete(false).export(true).build())
                .purchaseReturn(RolePermission.builder().read(false).create(false).update(false).delete(false).export(true).build())
                .damageItems(RolePermission.builder().read(true).create(false).update(false).delete(false).export(true).build())
                .fundLedger(RolePermission.builder().read(false).create(false).update(false).delete(false).export(true).build())
                .customer(RolePermission.builder().read(true).create(true).update(true).delete(false).export(true).build())
                .supplier(RolePermission.builder().read(false).create(false).update(false).delete(false).export(true).build())
                .report(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .staff(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .attendance(RolePermission.builder().read(true).create(false).update(false).delete(false).export(false).build())
                .store(store)
                .build();
    }
    private RoleSetting roleForGuard(Store store) {
        return RoleSetting.builder()
                .overview(RolePermission.builder().read(true).create(false).update(false).delete(false).export(false).build())
                .catalog(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .discount(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .stockCheck(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .invoice(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .returnInvoice(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .purchaseOrder(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .purchaseReturn(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .damageItems(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .fundLedger(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .customer(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .supplier(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .report(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .staff(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .attendance(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .store(store)
                .build();
    }
    private RoleSetting roleForWarehouseKeeper(Store store) {
        return RoleSetting.builder()
                .overview(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .catalog(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .discount(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .stockCheck(RolePermission.builder().read(true).create(true).update(false).delete(false).export(false).build())
                .invoice(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .returnInvoice(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .purchaseOrder(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .purchaseReturn(RolePermission.builder().read(true).create(true).update(false).delete(false).export(false).build())
                .damageItems(RolePermission.builder().read(true).create(true).update(false).delete(false).export(false).build())
                .fundLedger(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .customer(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .supplier(RolePermission.builder().read(true).create(true).update(true).delete(true).export(false).build())
                .report(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .staff(RolePermission.builder().read(false).create(false).update(false).delete(false).export(false).build())
                .attendance(RolePermission.builder().read(true).create(false).update(false).delete(false).export(false).build())
                .store(store)
                .build();
    }
}
