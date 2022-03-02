package com.asn.gateway.dto;

import com.asn.gateway.enums.Status;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
public class UserDto {

    @JsonAlias("id")
    private UUID id;

    @JsonAlias("inst_id")
    private UUID instId;

    @JsonAlias("inst_name")
    private String instName;

    @JsonAlias("user_code")
    private String userCode;

    @JsonAlias("user_name")
    private String userName;

    @JsonAlias("user_email")
    private String userEmail;

    @JsonAlias("user_provider")
    private String userProvider;

    @JsonAlias("user_role")
    private List<Object> userRole;

    @JsonAlias("user_role_structure")
    private Map<String, String> userRoleStructure;

    @JsonAlias("role_active")
    private UUID roleActive;

    @JsonAlias("user_admin")
    private boolean userAdmin;

    @JsonAlias("user_intro")
    private String userIntro;

    @JsonAlias("user_phone")
    private String userPhone;

    @JsonAlias("user_photo")
    private UUID userPhoto;

    @JsonAlias("user_gender")
    private String userGender;

    @JsonAlias("user_degree")
    private String userDegree;

    @JsonAlias("user_projects")
    private List<Object> userProjects;

    @JsonAlias("user_curriculum_vitae")
    private UUID userCurriculumVitae;

    @JsonAlias("user_skill")
    private List<Object> userSkill;

    @JsonAlias("user_interest")
    private List<Object> userInterest;

    @JsonAlias("user_country")
    private Map<String, String> userCountry;

    @JsonAlias("user_department")
    private Map<String, String> userDepartment;

    @JsonAlias("user_municipality")
    private Map<String, String> userMunicipality;

    @JsonAlias("user_status")
    private Status userStatus;

}
