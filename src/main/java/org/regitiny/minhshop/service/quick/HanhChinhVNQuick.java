package org.regitiny.minhshop.service.quick;

import lombok.extern.log4j.Log4j2;
import org.json.JSONObject;
import org.regitiny.minhshop.service.HanhChinhVNService;
import org.regitiny.minhshop.service.dto.HanhChinhVNDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Iterator;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
@Log4j2
public class HanhChinhVNQuick
{

  private final HanhChinhVNService hanhChinhVNService;

  @Value("${yuvytung.value.number-of-cities}")
  private int numberOfCities; //max =63

  public HanhChinhVNQuick(HanhChinhVNService hanhChinhVNService)
  {
    this.hanhChinhVNService = hanhChinhVNService;
  }

  @Autowired
  public void importingDataHanhChinhVN()
  {
    try
    {
//      File file = ResourceUtils.getFile("classpath:config/data/dist_vn/tree.json");
//      String stringJsonData = Files.readString(file.toPath());
      InputStream inputStream = getClass().getResourceAsStream("/config/data/dist_vn/tree.json");
      String stringJsonData = new BufferedReader(new InputStreamReader(Objects.requireNonNull(inputStream))).lines().collect(Collectors.joining("\n"));
      //      log.debug(stringJsonData);
      JSONObject jsonObjectData = new JSONObject(stringJsonData);

      Iterator<String> cityCodes = jsonObjectData.keys();
      //   đếm số thành phố
      int maxCities = 0;
      Iterator<String> cityCodes2 = jsonObjectData.keys();
      while (cityCodes2.hasNext())
      {
        maxCities++;
        cityCodes2.next();
      }
      // ToDo: giới hạn số lượng thành phố đc import vào database (prod thì xóa đi)
      maxCities = numberOfCities;
      log.info(" There are {} cities", maxCities);
      for (int count = 0; cityCodes.hasNext() && count < maxCities; count++)
      {
        String cityCode = cityCodes.next();
        JSONObject cityObject = jsonObjectData.getJSONObject(cityCode);

        insertData(cityObject, cityCode);

        if (cityObject.has("quan-huyen"))
        {
          JSONObject dist = cityObject.getJSONObject("quan-huyen");
          Iterator<String> distCodes = dist.keys();
          while (distCodes.hasNext())
          {
            String distCode = distCodes.next();
            JSONObject distObject = dist.getJSONObject(distCode);

            insertData(distObject, distCode);

            if (distObject.has("xa-phuong"))
            {
              JSONObject ward = distObject.getJSONObject("xa-phuong");
              Iterator<String> wardCodes = ward.keys();
              while (wardCodes.hasNext())
              {
                String wanCode = wardCodes.next();
                JSONObject wardObject = ward.getJSONObject(wanCode);

                insertData(wardObject, wanCode);
              }
            }
          }
        }
        log.info("{}/{} cities added", count + 1, maxCities);
      }
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }

  private void insertData(JSONObject data, String checkCode)
  {
    String name = null;
    String slug = null;
    String type = null;
    String nameWithType = null;
    String path = null;
    String pathWithType = null;
    String code = null;
    String parentCode = "0";

    if (data.has("name")) name = data.getString("name");
    if (data.has("slug")) slug = data.getString("slug");
    if (data.has("type")) type = data.getString("type");
    if (data.has("name_with_type")) nameWithType = data.getString("name_with_type");
    if (data.has("path")) path = data.getString("path");
    if (data.has("path_with_type")) pathWithType = data.getString("path_with_type");
    if (data.has("code")) code = data.getString("code");
    if (data.has("parent_code")) parentCode = data.getString("parent_code");

    if (
      Objects.nonNull(name) &&
        Objects.nonNull(slug) &&
        Objects.nonNull(type) &&
        Objects.nonNull(nameWithType) &&
        Objects.nonNull(code) &&
        checkCode.equals(code)
    )
    {
      HanhChinhVNDTO hanhChinhVNDTO = new HanhChinhVNDTO();
      hanhChinhVNDTO.setName(name);
      hanhChinhVNDTO.setSlug(slug);
      hanhChinhVNDTO.setType(type);
      hanhChinhVNDTO.setNameWithType(nameWithType);
      hanhChinhVNDTO.setPath(path);
      hanhChinhVNDTO.setPathWithType(pathWithType);
      hanhChinhVNDTO.setCode(code);
      hanhChinhVNDTO.setParentCode(parentCode);
      hanhChinhVNService.save(hanhChinhVNDTO);
      log.debug("ok");
    }
    else log.warn("Có lỗi xuất hiện ở đây");
  }
}
