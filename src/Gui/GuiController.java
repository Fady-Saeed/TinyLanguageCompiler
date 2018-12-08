package src.Gui;

import javafx.fxml.FXML;
import javafx.scene.control.TextField;
import javafx.stage.DirectoryChooser;
import javafx.stage.FileChooser;
import src.Compiler.Scanner;
import src.Helper.Tuple;
import src.Main;

import java.io.*;

public class GuiController {
    @FXML public TextField inputPathTextField;
    @FXML public TextField outputPathTextField;

    public void selectInputPath()
    {
        String inputPath = getTxtFilePath();

        if(inputPath != null)
            inputPathTextField.setText(inputPath);
    }

    public void selectOutputPath()
    {
        String outputPath = getFolderPath();

        if(outputPath != null)
            outputPathTextField.setText(outputPath);
    }

    private String getFolderPath()
    {
        DirectoryChooser directoryChooser = new DirectoryChooser();
        File selectedDirectory = directoryChooser.showDialog(Main.sharedPrimaryStage);
        if(selectedDirectory == null) return null;
        else return selectedDirectory.getPath();
    }

    private String getTxtFilePath()
    {
        final FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Code File");
        fileChooser.setInitialDirectory(
                new File(System.getProperty("user.home"))
        );

        fileChooser.getExtensionFilters().addAll(
                new FileChooser.ExtensionFilter("All Files", "*.*"),
                new FileChooser.ExtensionFilter("TXT", "*.txt")

        );

        File file = fileChooser.showOpenDialog(Main.sharedPrimaryStage);

        if(file == null) return null;

        else return file.getPath();
    }


    public void scan()
    {
        try {

            String path = inputPathTextField.getText();

            File inputFile = new File(path);
            if (!inputFile.isFile()) {
                AlertBox.display("Error happened" , "please check the inputs");
                return;
            }

            BufferedReader inputBR = new BufferedReader(new FileReader(inputFile));
            StringBuilder inputCode = new StringBuilder();

            String line;
            while ((line = inputBR.readLine()) != null)
                inputCode.append(line);

            Scanner scanner = new Scanner(inputCode.toString());

            String outputFilePath = outputPathTextField.getText() + "/Scanner_output.txt";

            BufferedWriter outputBR = new BufferedWriter(new FileWriter(outputFilePath));

            Tuple token = scanner.next();
            while (token != null) {
                outputBR.write(token.x + " , " + token.y + "\r\n");
                token = scanner.next();
            }

            outputBR.close();

            AlertBox.display("File scanned successfully" , "Scanned successfully");

        }

        catch (Exception e)
        {
            AlertBox.display("Error happened" , "please check the inputs");
        }

    }
}
