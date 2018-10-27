package src;

import src.Compiler.Scanner;
import src.Helper.Tuple;

public class Main {
    public static void main(String[] argv)
    {
        Scanner scanner = new Scanner("{sample program in TINY language- computes factorial}\n" +
                "read x;{input an integer}\n" +
                "if 0<x then {don’t compute if x<=0}\n" +
                "fact:=1;\n" +
                "repeat\n" +
                "fact:=fact*x;\n" +
                "x:=x-1\n" +
                "until x=0;\n" +
                "write fact{output factorial of x}\n" +
                "end");

        Tuple token = scanner.next();
        while (token != null)
        {
            System.out.println(token.x + " => " + token.y);
            token = scanner.next();
        }



    }
}
