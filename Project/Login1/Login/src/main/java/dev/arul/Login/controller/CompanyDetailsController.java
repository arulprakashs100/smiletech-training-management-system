package dev.arul.Login.controller;

import dev.arul.Login.model.CompanyDetails;
import dev.arul.Login.repository.CompanyDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "*")
public class CompanyDetailsController {

    @Autowired
    private CompanyDetailsRepository companyDetailsRepository;

    @GetMapping
    public ResponseEntity<CompanyDetails> getCompanyDetails() {
        List<CompanyDetails> details = companyDetailsRepository.findAll();
        if (!details.isEmpty()) {
            return ResponseEntity.ok(details.get(0));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping
    public ResponseEntity<CompanyDetails> updateCompanyDetails(@RequestBody CompanyDetails companyDetails) {
        List<CompanyDetails> details = companyDetailsRepository.findAll();
        CompanyDetails detailsToSave;
        if (!details.isEmpty()) {
            detailsToSave = details.get(0);
            detailsToSave.setName(companyDetails.getName());
            detailsToSave.setAddress(companyDetails.getAddress());
            detailsToSave.setEmail(companyDetails.getEmail());
            detailsToSave.setPhone(companyDetails.getPhone());
            detailsToSave.setBranches(companyDetails.getBranches());
            detailsToSave.setAbout(companyDetails.getAbout());
        } else {
            detailsToSave = companyDetails;
        }
        return ResponseEntity.ok(companyDetailsRepository.save(detailsToSave));
    }
}
