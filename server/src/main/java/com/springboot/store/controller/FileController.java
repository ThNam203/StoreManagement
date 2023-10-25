package com.springboot.store.controller;

import com.springboot.store.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import com.amazonaws.HttpMethod;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.UUID;

@RestController
@RequestMapping("/api/file")

public class FileController {
    @Autowired
    private FileService fileService;
    @PostMapping("/uploadFile")
    public ResponseEntity<String> uploadFile(@RequestParam(value="file") MultipartFile file) {
        return new ResponseEntity<>(fileService.uploadFile(file), HttpStatus.OK);
    }
    @GetMapping("/downloadFile/{fileName}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileName){
        byte[] data = fileService.downloadFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type","application/octet-stream")
                .header("Content-disposition","attachment; filename=\""+fileName+"\"")
                .body(resource);
    }
    @DeleteMapping("/delete/{fileName}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName){
        return new ResponseEntity<>(fileService.deleteFile(fileName), HttpStatus.OK);
    }

}
