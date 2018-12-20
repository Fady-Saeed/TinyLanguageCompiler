package src.Gui;

import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebEvent;
import javafx.scene.web.WebView;
import javafx.stage.Modality;
import javafx.stage.Stage;

import java.io.File;
import java.net.URL;

public class SyntaxTree {
    public static void display() {
        Stage window = new Stage();

        //Block events to other windows
        window.initModality(Modality.APPLICATION_MODAL);
        window.setTitle("Syntax Tree");
        window.setMinWidth(840);
        window.setMinHeight(600);

        Button closeButton = new Button("Close !");
        closeButton.setOnAction(e -> window.close());

        URL url = SyntaxTree.class.getResource("../SyntaxTreeDrawer/index.html");
        WebView browser = new WebView();
        WebEngine webEngine = browser.getEngine();
        webEngine.load(url.toString());
        browser.getEngine().setOnAlert((WebEvent<String> wEvent) -> {
            System.out.println("JS alert() message: " + wEvent.getData() );
        });

        VBox layout = new VBox(10);
        layout.getChildren().addAll(browser,closeButton);
        layout.setAlignment(Pos.CENTER);
        layout.setPadding(new Insets(10, 10, 10, 10));

        //Display window and wait for it to be closed before returning
        Scene scene = new Scene(layout);
        window.setScene(scene);
        window.showAndWait();
    }
}
