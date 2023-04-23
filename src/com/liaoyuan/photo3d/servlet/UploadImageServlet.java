package com.liaoyuan.photo3d.servlet;

import com.liaoyuan.photo3d.pojo.Image;
import com.liaoyuan.photo3d.service.ImageService;
import com.liaoyuan.photo3d.service.impl.ImageServiceImpl;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.UUID;

@WebServlet("/photo3d/uploadImageServlet")
@MultipartConfig
public class UploadImageServlet extends HttpServlet{

	private static final long serialVersionUID = 13123253453L;

	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Logger logger = Logger.getLogger(this.getClass());
	    req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        
        //所有上传的文件
        Collection<Part> parts = req.getParts();
        Iterator<Part> iterator = parts.iterator();
        Part part = null;
        //用户的图片id
        String userImageId = UUID.randomUUID().toString();
        int order = 1;
        ImageService imageService = new ImageServiceImpl();
        while(iterator.hasNext()){
            part = iterator.next();
            //使用日期生成文件夹
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy/MM/dd");
            String time = simpleDateFormat.format(new Date());
            String fileName = part.getHeader("content-disposition");
            //头部content-disposition的内容为form-data; name="pictureFile"; filename="阿柒3.jpg"，
            //因此需要获取真正的fileName先定位到filename=的位置，加上filename=的长度，因为还有引号"，因此还需加1
            int index = fileName.indexOf("filename=") + "filename=".length() + 1;
            //毫秒数 + 文件名，避免文件名重复
            fileName = System.currentTimeMillis() + "_" + fileName.substring(index,fileName.length()-1);
            //将后缀名改为.jpg，因为后面压缩图片时后缀名使用jpg
            fileName = fileName.replaceAll("\\.\\w+", ".jpg");
            //文件名如果有[wewr23432]这样的字符则去掉
            fileName = fileName.replaceAll("\\[.*\\]","");
            logger.info("上传图片文件名："+fileName);
            //System.out.println(fileName);

            String destPath = req.getServletContext().getRealPath("/photo3d/upload/image/") + File.separator + time;
            logger.info("图片存储路径为："+destPath);
            //System.out.println(destPath);

            File destPathFile = new File(destPath);
            if (!destPathFile.exists()){
                boolean result = destPathFile.mkdirs();
                logger.info("图片存储路径创建结果为："+result);
            }
            
            //写入到文件中
            if(part.getSize() > 0){
                if(part.getSize() > 1024 * 1024){
                	//如果图片大于1M，则先压缩再存储
                	Thumbnails.of(part.getInputStream())
                	.scale(1f)
                	.outputQuality(0.5f)
                	.outputFormat("jpg")
                	.toFile(destPath+ File.separator + fileName);
                }else{
                	part.write(destPath+ File.separator + fileName);
                }
            }
            
            Image image = new Image();
            image.setUserId(userImageId);
            image.setImageName(fileName);
            image.setImagePath("url(upload/image/"+time+"/"+fileName+")");
            image.setInsertDate(new Timestamp(System.currentTimeMillis()));
            image.setOrder(order++);
            image.setSingle(false);
            imageService.addImage(image);
        }

        PrintWriter writer = resp.getWriter();
        //返回userImageId
        writer.print(userImageId);
        writer.close();
	}
}
