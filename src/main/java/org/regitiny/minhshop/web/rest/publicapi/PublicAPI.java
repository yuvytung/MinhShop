package org.regitiny.minhshop.web.rest.publicapi;

import lombok.extern.log4j.Log4j2;
import org.regitiny.minhshop.service.FileService;
import org.regitiny.minhshop.service.business.FfmpegBusiness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.time.Instant;
import java.util.logging.Level;

@Log4j2
@RestController
@RequestMapping("/public_api")
public class PublicAPI
{

  //  public static final String VideoUploadingDir = "D:\\";
  public static final String VideoUploadingDir = "/root/minh-shop/";
  private final FileService fileService;
  private final FfmpegBusiness ffmpegBusiness;
  @Autowired
  VideoStreamingService service;


  public PublicAPI(FileService fileService, FfmpegBusiness ffmpegBusiness)
  {
    this.fileService = fileService;
    this.ffmpegBusiness = ffmpegBusiness;
  }

//  public static final String VideoUploadingDir = System.getProperty("user.dir") + "/Uploads/Posts/Videos";

  private int songSong(int in)
  {
    try
    {
      Thread.sleep(in * 1000L);
      log.info("có cái đéo gì đó ở đây đó là  {}", in);
      return in;
    }
    catch (InterruptedException e)
    {
      e.printStackTrace();
      return in;
    }
  }

  @GetMapping(value = "/video", produces = "application/octet-stream")
  public ResponseEntity<ResourceRegion> getVideo(@RequestHeader(value = "Range", required = false) String rangeHeader)
    throws IOException
  {

    if (!new java.io.File(VideoUploadingDir).exists())
    {
      new java.io.File(VideoUploadingDir).mkdirs();
    }
    return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
      .contentType(MediaType.valueOf("video/mp4"))
      .body(service.getVideoRegion(rangeHeader, VideoUploadingDir));


  }

  @GetMapping(value = "/video/flux")
  public ResponseEntity<byte[]> getVideoFlux(@RequestHeader(value = "Range", required = false) String rangeHeader)
    throws IOException
  {
    var start = 0;
    if (rangeHeader != null)
    {
      start = Integer.parseInt(rangeHeader.replace("bytes=", "").replace("-", ""));
    }
    java.io.File file = new java.io.File(VideoUploadingDir + "video.mp4");
    java.io.File file2 = new java.io.File(VideoUploadingDir + "video2.mp4");

    RandomAccessFile randomAccessFile = new RandomAccessFile(file, "r");
    RandomAccessFile randomAccessFile2 = new RandomAccessFile(file2, "rw");

    byte[] result = new byte[10 * 1024 * 1024];
    randomAccessFile.seek(start);
    randomAccessFile.read(result);

    if (start > randomAccessFile2.length())
    {
      byte[] newFile2 = new byte[start + 10 * 1024 * 1024 - (int) randomAccessFile2.length()];
      randomAccessFile.seek(randomAccessFile2.length());
      randomAccessFile.read(newFile2);
      randomAccessFile2.seek(randomAccessFile2.length());
      randomAccessFile2.write(newFile2);
    }


    int end = Math.min((start + 10 * 1024 * 1024 - 1), (int) randomAccessFile.length() - 1);
    return ResponseEntity.status(206)
      .contentType(MediaType.parseMediaType("video/mp4"))
      .contentLength(result.length)
      .header("Content-Range", "bytes " + start + "-" + end + "/" + randomAccessFile.length())
      .body(result);
  }

  @GetMapping(value = "/video/flux2")
  public ResponseEntity<ResourceRegion> getVideoFlux2(@RequestHeader(value = "Range", required = false) String rangeHeader)
    throws IOException
  {
    var start = 0;
    if (rangeHeader != null)
      start = Integer.parseInt(rangeHeader.replace("bytes=", "").replace("-", ""));
    java.io.File file = new java.io.File(VideoUploadingDir + "video2.mp4");
    Resource r = new FileSystemResource(file);
//    byte[] data = new FileInputStream(file).readAllBytes();
    ResourceRegion result2 = new ResourceRegion(r, start, 10 * 1024 * 1024);
    return ResponseEntity.status(206)
      .contentType(MediaType.parseMediaType("video/mp4"))
      .body(result2);
  }

  @GetMapping(value = "/hihi", produces = MediaType.APPLICATION_STREAM_JSON_VALUE)
//  @Cacheable(key = "#id")
  public Mono<ResponseEntity<String>> getImagexx(@RequestParam("id") Integer id)
  {
    log.debug(ffmpegBusiness.runCommand("echo 1234xx"));
    Instant now = Instant.now();
    var a = Flux.just(6, 1, 5, 2, 4, 7).log("có đéo gì {} , {}", Level.INFO)
      .flatMap(o ->
        Flux.just(o + id).map(this::songSong).subscribeOn(Schedulers.elastic())
      )
      .map(integer ->
      {
        log.info("đầu tiên là sẽ thế này , {}", integer);
        Mono.just(integer + id).map(this::songSong).subscribeOn(Schedulers.elastic());
        return integer;
      })
      .subscribe(integerFlux -> log.info("cuối cùng thì id la :{}", now));
    return Mono
      .just(ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, String.valueOf(MediaType.APPLICATION_JSON)).body("xxyyzz"));
  }
}


