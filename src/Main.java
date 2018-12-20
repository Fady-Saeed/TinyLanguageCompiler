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

    @Override
    public void start(Stage primaryStage) throws Exception{

        src.Compiler.Parser parser = new Parser("{ Sample program in TINY language – computes factorial\n" +
                "}\n" +
                "read x; {input an integer }\n" +
                "if 0 < x then { don’t compute if x <= 0 }\n" +
                "fact := 1;\n" +
                "repeat\n" +
                "fact := fact * x;\n" +
                "x := x - 1\n" +
                "until x = 0;\n" +
                "write fact { output factorial of x }\n" +
                "end;\n" +
                "read x");

        Gson gson = new GsonBuilder().disableHtmlEscaping().setPrettyPrinting().create();
        String jsonOutput = gson.toJson(parser.program());

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
