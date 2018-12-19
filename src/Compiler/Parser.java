package src.Compiler;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import src.Helper.Constants;

public class Parser {
    private Scanner scanner;

    public Parser(String inputCode)
    {
        scanner = new Scanner(inputCode);
    }


    JSONObject factor()
    {
        String value = scanner.top().x;
        String type = scanner.top().y;
        JSONObject result = null;
        if(type.equals(Constants.Scanner.TokeyType.IDENTIFIER) || type.equals(Constants.Scanner.TokeyType.NUMBER))
        {
            result = new JSONObject();
            result.put("type", "factor");
            result.put("value" , value);
            scanner.next();
        }

        else if(value.equals("("))
        {
            scanner.next(); //"("
            JSONObject jsonValue = exp();
            scanner.next(); //")"
            result = new JSONObject();
            result.put("type", "factor");
            result.put("value" , jsonValue);
        }

        return result;

    }



    JSONObject term()
    {
        JSONObject result = factor();

        if(scanner.isDone())
            return result;

        while ( scanner.top().x.equals("*") || scanner.top().x.equals("/"))
        {
            JSONObject temp = result;
            result = new JSONObject();
            result.put("op" , scanner.top().x);

            scanner.next();

            JSONObject rhs = factor();


            result.put("type", "term");
            result.put("lhs" , temp);
            result.put("rhs", rhs);

            if(scanner.isDone())
                return result;

            }

        return result;
    }

    JSONObject simple_exp()
    {
        JSONObject result = term();
        if(scanner.isDone())
            return result;

        while (scanner.top().x.equals("+") || scanner.top().x.equals("-"))
        {
            JSONObject temp = result;
            result = new JSONObject();
            result.put("op" , scanner.top().x);

            scanner.next();

            JSONObject rhs = term();


            result.put("type", "simple_exp");
            result.put("lhs" , temp);
            result.put("rhs", rhs);

            if(scanner.isDone())
                return result;
        }

        return result;
    }


    JSONObject exp()
    {
        JSONObject result = simple_exp();

        if(scanner.isDone())
            return result;

        while (scanner.top().x.equals("<") || scanner.top().x.equals("="))
        {
            JSONObject temp = result;
            result = new JSONObject();
            result.put("op" , scanner.top().x);

            scanner.next();

            JSONObject rhs = simple_exp();


            result.put("type", "exp");
            result.put("lhs" , temp);
            result.put("rhs", rhs);


            if(scanner.isDone())
                return result;
        }

        return result;
    }



    JSONObject write()
    {
        JSONObject result = null;

        if(scanner.top().x.equals("write"))
        {
            scanner.next();
            JSONObject e = exp();
            result = new JSONObject();
            result.put("type", "write");
            result.put("exp", e);

        }

        return result;
    }


    JSONObject read()
    {
        JSONObject result = null;

        if(scanner.top().x.equals("read"))
        {
            scanner.next();
            if(scanner.top().y.equals(Constants.Scanner.TokeyType.IDENTIFIER)) {
                String id = scanner.next().x;
                result = new JSONObject();
                result.put("type", "read");
                result.put("identifier", id);
            }
        }

        return result;
    }


    JSONObject assign()
    {
        JSONObject result = null;
        if(scanner.top().y.equals(Constants.Scanner.TokeyType.IDENTIFIER))
        {
            String id = scanner.next().x;
            if(scanner.top().x.equals(":="))
            {
                scanner.next();
                JSONObject e = exp();
                result = new JSONObject();
                result.put("type", "assign");
                result.put("identifier", id);
                result.put("exp", e);

            }
        }

        return result;
    }

    JSONObject repeat()
    {
        JSONObject result = null;

        if(scanner.top().x.equals("repeat"))
        {
            scanner.next();
            JSONObject stmt_seq = stmt_sequence();
            if(scanner.top().x.equals("until"))
            {
                scanner.next();
                JSONObject e = exp();
                result = new JSONObject();
                result.put("type", "repeat");
                result.put("body", stmt_seq);
                result.put("test" , e);
            }
        }

        return result;
    }


    JSONObject if_stmt()
    {
        JSONObject result = null;

        if(scanner.top().x.equals("if"))
        {
            scanner.next();
            JSONObject test = exp();
            if(scanner.top().x.equals("then"))
            {
                scanner.next();
                JSONObject then = stmt_sequence();
                if(scanner.top().x.equals("else"))
                {
                    scanner.next();
                    JSONObject Else = stmt_sequence();
                    scanner.next();

                    result = new JSONObject();
                    result.put("type", "if");
                    result.put("then", then);
                    result.put("else", Else);
                    result.put("test", test);
                }

                else {
                    scanner.next();
                    result = new JSONObject();
                    result.put("type", "if");
                    result.put("then", then);
                    result.put("else", "null");
                    result.put("test", test);
                }
            }
        }

        return result;
    }



    JSONObject statement()
    {
        String value = scanner.top().x;

        if(value.equals("read")) return read();
        else if(value.equals("write"))
            return write();
        else if(value.equals("repeat")) return repeat();
        else if(value.equals("if")) return if_stmt();
        else return assign();

    }


    JSONObject stmt_sequence()
    {
        int counter = 0;
        JSONObject result = new JSONObject();
        result.put("type", "stmt_sequence");
        JSONArray arr = new JSONArray();
        arr.add(statement());

        if(scanner.isDone())
        {
            result.put("children", arr);
            return result;
        }

        while (scanner.top().x.equals(";"))
        {

            scanner.next();
            arr.add(statement());
            if(scanner.isDone())
                break;
        }

        result.put("children", arr);
        return result;
    }


    public JSONObject program()
    {
        return stmt_sequence();
    }

}
