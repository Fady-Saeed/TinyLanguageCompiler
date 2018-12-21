package src;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import org.json.simple.parser.JSONParser;
import src.Compiler.Parser;
import src.Compiler.Scanner;
import src.Gui.SyntaxTree;
import src.Helper.Tuple;

import java.io.BufferedWriter;
import java.io.FileWriter;

public class Main extends Application {

    public static Stage sharedPrimaryStage;
    public static String json;
    @Override
    public void start(Stage primaryStage) throws Exception{

        src.Compiler.Parser parser = new Parser("x:=2;\n" +
                "y:=3;\n" +
                "z:=5;\n" +
                "a:=x+y+z;\n" +
                "if z<8 then\n" +
                "repeat\n" +
                "a:=a*2;\n" +
                "z:=z-1\n" +
                "until\n" +
                "z=0;\n" +
                "write a\n" +
                "else\n" +
                "read b;\n" +
                "if b=1 then \n" +
                "write b*(x-y)\n" +
                "else\n" +
                "write a\n" +
                "end \n" +
                "\n" +
                "end;\n" +
                "write z");

        Gson gson = new GsonBuilder().disableHtmlEscaping().setPrettyPrinting().create();
        String jsonOutput = gson.toJson(parser.program());
        json = jsonOutput;

        BufferedWriter outputBR = new BufferedWriter(new FileWriter("./src/SyntaxTreeDrawer/dest/js/SyntaxTree.js"));
        outputBR.write("let json = " + jsonOutput);
        outputBR.close();

        Parent root = FXMLLoader.load(getClass().getResource("Gui/Gui.fxml"));
        primaryStage.setTitle("Scanner");
        primaryStage.setScene(new Scene(root, 600, 250));
        primaryStage.show();
        sharedPrimaryStage = primaryStage;
    }

    public static void main(String[] args) throws Exception
    {
        launch(args);
    }
}
