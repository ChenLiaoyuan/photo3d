package test;

import net.coobird.thumbnailator.Thumbnails;

import java.io.File;
import java.io.IOException;

/**
 * @author CLY
 * @date 2021/2/4 22:27
 **/
public class PictureTest {

    public static void main(String[] args) throws IOException {

        Thumbnails.of("C:\\Users\\陈燎原\\Pictures\\身份证\\身份证反面.jpg")
                .scale(1)
                .outputQuality(0.4f)
//                .size(576,360)
                .outputFormat("jpg")
                .toFile("C:\\Users\\陈燎原\\Pictures\\身份证\\身份证反面_cut2.jpg");
    }
}
