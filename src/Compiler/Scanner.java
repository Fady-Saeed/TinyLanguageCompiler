package src.Compiler;
import src.Helper.Tuple;
import src.Helper.Constants;


public class Scanner {

    //to keep track of the input characters so far
    private StringBuilder currentContent;
    private StringBuilder inputCode;

    private enum State {
        START, INCOMMENT, INNUM, INID, INASSIGN, DONE, ERROR
    }

    private State state;


    private String[] reservedWords = {"if", "then", "else", "end", "repeat", "until", "read", "write"};



    public Scanner(String inputCode)
    {
        this.currentContent = new StringBuilder();
        this.inputCode = new StringBuilder(inputCode);
        state = State.START;
    }

    private Tuple<String, String> step()
    {

        char extractedChar = inputCode.charAt(0);
        inputCode.deleteCharAt(0);

        if (inputCode.length() == 0)
        {
            String content = currentContent.toString();
            currentContent = new StringBuilder("");
            switch (state)
            {
                case INNUM: return new Tuple<>(content, Constants.Scanner.TokeyType.NUMBER);
                case INID: return new Tuple<>(content, Constants.Scanner.TokeyType.IDENTIFIER);
                //case INCOMMENT: return new Tuple<>(currentContent.toString(), "Identifier");
                default: state = State.ERROR; return null;
            }
        }

        switch (state)
        {
            case START: case DONE:

                {
                    if (isDigit(extractedChar)) {
                        currentContent.append(extractedChar);
                        state = State.INNUM;
                    } else if (isLetter(extractedChar)) {
                        currentContent.append(extractedChar);
                        state = State.INID;
                    } else if (extractedChar == ':') {
                        currentContent.append(extractedChar);
                        state = State.INASSIGN;
                    } else if (extractedChar == '{') {
                        currentContent.append(extractedChar);
                        state = State.INCOMMENT;
                    } else if (!isWhiteSpace(extractedChar)) {
                        state = State.DONE;
                        return new Tuple<>("" + extractedChar, Constants.Scanner.TokeyType.SPECIAL_SYMPOL);
                    }


                    break;
                }

            case INCOMMENT: {
                        if (extractedChar == '}') {
                            currentContent.append(extractedChar);
                            state = State.START;
                            String token = currentContent.toString();
                            currentContent.setLength(0); //clear the buffer for new token
                           // return new Tuple<>(token, "Comment");
                            return null;
                        } else {
                            currentContent.append(extractedChar);
                        }

                        break;
                    }


            case INNUM: {
                        if(isDigit(extractedChar)){
                            currentContent.append(extractedChar);
                        }
                        else {
                            state = State.DONE;
                            inputCode.insert(0, extractedChar);
                            String token = currentContent.toString();
                            currentContent.setLength(0); //clear the buffer for new token
                            return new Tuple<>(token, Constants.Scanner.TokeyType.NUMBER);
                        }

                        break;
                    }

            case INID: {
                        if(isLetter(extractedChar)){
                            currentContent.append(extractedChar);
                        }
                        else {
                            state = State.DONE;
                            inputCode.insert(0, extractedChar);
                            String token = currentContent.toString();
                            currentContent.setLength(0); //clear the buffer for new token
                            return new Tuple<>(token, Constants.Scanner.TokeyType.IDENTIFIER);
                        }

                        break;
                    }

            case INASSIGN: {
                        if(extractedChar == '=')
                        {
                            state = State.DONE;
                            currentContent.append(extractedChar);
                            String token = currentContent.toString();
                            currentContent.setLength(0); //clear the buffer for new token
                            return new Tuple<>(token, Constants.Scanner.TokeyType.ASSIGN);
                        }
                        else {
                            state = State.DONE;
                            inputCode.insert(0, extractedChar);
                            String token = currentContent.toString();
                            currentContent.setLength(0); //clear the buffer for new token
                            return new Tuple<>(token, Constants.Scanner.TokeyType.SPECIAL_SYMPOL);
                        }
                    }

                default: state = State.ERROR;

        }

        return null;


    }


    public Tuple<String, String> next()
    {

        Tuple<String, String> token = null;

        while(token == null)
        {
            if(inputCode.length()==0)
                return null;

            token = this.step();
        }

        if(token.y.equals(Constants.Scanner.TokeyType.IDENTIFIER))
        {
            for (String word : reservedWords)
                if(token.x.equals(word)) {
                    token.y = Constants.Scanner.TokeyType.RESERVED_WORD;
                    break;
                }
        }


        return token;
    }


    public Tuple<String, String> nextTop()
    {

        Tuple<String, String> token = null;

        while(token == null)
        {
            if(inputCode.length()==0)
                return null;

            token = this.step();
        }

        if(token.y.equals(Constants.Scanner.TokeyType.IDENTIFIER))
        {
            for (String word : reservedWords)
                if(token.x.equals(word)) {
                    token.y = Constants.Scanner.TokeyType.RESERVED_WORD;
                    break;
                }
        }


        return token;
    }



    public Tuple<String, String> top()
    {
        Tuple<String, String> temp =  this.nextTop();
        if(temp != null)
        inputCode.insert(0,temp.x  + " ");
        return temp;
    }

    public String nextToken()
    {
        return this.next().y;
    }


    public boolean isDone()
    {return inputCode.length()==0;}



    private boolean isDigit(char c)
    {
        return c >= '0' && c <= '9' ;
    }


    private boolean isLetter(char c)
    {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    }


    private boolean isWhiteSpace(char c)
    {
        return (c == ' ') || (c == '\n') || (c == '\t') || (c == '\r');
    }
}
