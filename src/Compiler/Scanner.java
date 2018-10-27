package src.Compiler;
import src.Helper.Tuple;


public class Scanner {

    //to keep track of the input characters so far
    private StringBuilder currentContent;
    private StringBuilder inputCode;
    private boolean finished;

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
        finished = false;
    }

    private Tuple<String, String> step()
    {
        if (inputCode.length() == 0)
        {
            finished = true;
            switch (state)
            {
                case INNUM: return new Tuple<>(currentContent.toString(), "Number");
                case INID: return new Tuple<>(currentContent.toString(), "Identifier");
                //case INCOMMENT: return new Tuple<>(currentContent.toString(), "Identifier");
                default: state = State.ERROR; return null;
            }
        }

        char extractedChar = inputCode.charAt(0);
        inputCode.deleteCharAt(0);

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
                        return new Tuple<>("" + extractedChar, "Special sympol");
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
                            return new Tuple<>(token, "Number");
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
                            return new Tuple<>(token, "Identifier");
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
                            return new Tuple<>(token, "Assign");
                        }
                        else {
                            state = State.DONE;
                            inputCode.insert(0, extractedChar);
                            String token = currentContent.toString();
                            currentContent.setLength(0); //clear the buffer for new token
                            return new Tuple<>(token, "Special sympol");
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
            if(finished)
                return null;

            token = this.step();
        }

        if(token.y.equals("Identifier"))
        {
            for (String word : reservedWords)
                if(token.x.equals(word)) {
                    token.y = "Reserved word";
                    break;
                }
        }


        return token;
    }


    public String nextToken()
    {
        return this.next().y;
    }



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
