package com.Ralo.ecom.model;

import com.Ralo.ecom.domain.AccountStatus;
import com.Ralo.ecom.domain.USER_ROLE;
import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EqualsAndHashCode
@Getter
@Setter
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String sellerName;

    private String mobile;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Embedded
    private BankDetails bankDetails = new BankDetails();

    @Embedded
    private BusinessDetails businessDetails = new BusinessDetails();

    @OneToOne(cascade = CascadeType.ALL)
    private Address pickupAddress = new Address();

    private USER_ROLE role = USER_ROLE.ROLE_SELLER;

    private boolean isEmailVerified = false;

    private String GSTIN;

    private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;
}