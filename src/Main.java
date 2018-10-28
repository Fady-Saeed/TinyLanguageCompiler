package src;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

    public static Stage sharedPrimaryStage;

    @Override
    public void start(Stage primaryStage) throws Exception{
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
