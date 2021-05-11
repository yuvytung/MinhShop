package org.regitiny.minhshop.web.websocket;

import lombok.extern.log4j.Log4j2;
import org.regitiny.minhshop.web.websocket.dto.ActivityDTO;
import org.regitiny.minhshop.web.websocket.dto.VideoCallDTO;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.io.File;
import java.io.FileOutputStream;
import java.security.Principal;
import java.util.Base64;

@Log4j2
@Controller
public class WebSocket implements ApplicationListener<SessionDisconnectEvent>
{
  private final SimpMessageSendingOperations messagingTemplate;

  public WebSocket(SimpMessageSendingOperations messagingTemplate)
  {
    this.messagingTemplate = messagingTemplate;
  }

  @MessageMapping("/topic/video-call/activity")
  @SendTo("/topic/video-call/group/1234x")
  public VideoCallDTO sendActivity(@Payload VideoCallDTO x, StompHeaderAccessor stompHeaderAccessor, Principal principal)
  {
//    byte[] decodedBytes = Base64.getDecoder().decode(x.getData().split(",")[2]);
//    File tempFile = new File("/data/test/test.webm");
//    try (FileOutputStream out = new FileOutputStream(tempFile, true))
//    {
//      log.debug("create new file output VideoCall (webcam) is: {}", tempFile.createNewFile());
//      out.write(decodedBytes);
//    }
//    catch (Exception e)
//    {
//      log.debug(e);
//    }
    return x;
  }

  @Override
  public void onApplicationEvent(SessionDisconnectEvent event)
  {
    ActivityDTO activityDTO = new ActivityDTO();
    activityDTO.setSessionId(event.getSessionId());
    activityDTO.setPage("logout");
    messagingTemplate.convertAndSend("/topic/video-call/group", activityDTO);
  }
}
