package com.CapstoneProject.CarbonFootprintTrack.controller;

import com.CapstoneProject.CarbonFootprintTrack.ResponseDto.*;
import com.CapstoneProject.CarbonFootprintTrack.entities.CarbonFootprintForm;
import com.CapstoneProject.CarbonFootprintTrack.model.CarbonFootPrint;
import com.CapstoneProject.CarbonFootprintTrack.model.User;
import com.CapstoneProject.CarbonFootprintTrack.model.leaderBoard;
import com.CapstoneProject.CarbonFootprintTrack.service.CarbonTrackService;
import com.CapstoneProject.CarbonFootprintTrack.service.LeaderBoardService;
import com.CapstoneProject.CarbonFootprintTrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/carbonTrack")
public class CarbonTrackController {

    @Autowired
    private CarbonTrackService carbonTrackService;

    @Autowired
    private UserService userService;

    @Autowired
    private LeaderBoardService leaderBoardService;


    @GetMapping("/profile/{userId}")
    public UserDto getUserProfile(@PathVariable Long userId) {
        return userService.getUserProfile(userId);
    }

    @GetMapping("/allUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/allcarbondetails")
    public List<CarbonFootPrint> getAllCarbonDetails() {
        return carbonTrackService.getAllCarbonDetails();
    }

    @GetMapping("/user/{userId}/dashboard")
    public List<DashboardResponseDto> getDashboard(@PathVariable Long userId) {
        return carbonTrackService.getDashboard(userId);
    }

    @GetMapping("/user/{userId}/electricity")
    public List<ElectricityDto> getElectricityCarbonFootprint(@PathVariable Long userId) {
        return carbonTrackService.getElectricityCarbonFootprint(userId);
    }

    @GetMapping("/user/{userId}/wastage")
    public List<WastageDto> getWastageCarbonFootprint(@PathVariable Long userId) {
        return carbonTrackService.getWastageCarbonFootprint(userId);
    }

    @GetMapping("/user/{userId}/transportation")
    public List<TransportationDto> getTransportation(@PathVariable Long userId) {
        return carbonTrackService.getTransportation(userId);
    }

    @GetMapping("/leaderBoard/{city}")
    public List<leaderBoard> getLeaderBoard(@PathVariable String city) {
        return leaderBoardService.getLeaderBoard(city);
    }

    @PostMapping("/calculateAndSubmit")
    public ResponseEntity<String> calculateAndSubmit(@RequestBody CarbonFootprintForm form) {
        return carbonTrackService.calculateAndSubmit(form);
    }
}
