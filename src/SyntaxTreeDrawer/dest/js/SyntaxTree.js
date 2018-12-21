let json = {
  "children": [
    {
      "identifier": "x",
      "type": "assign",
      "exp": {
        "type": "factor",
        "value": "2"
      }
    },
    {
      "identifier": "y",
      "type": "assign",
      "exp": {
        "type": "factor",
        "value": "3"
      }
    },
    {
      "identifier": "z",
      "type": "assign",
      "exp": {
        "type": "factor",
        "value": "5"
      }
    },
    {
      "identifier": "a",
      "type": "assign",
      "exp": {
        "op": "+",
        "lhs": {
          "op": "+",
          "lhs": {
            "type": "factor",
            "value": "x"
          },
          "type": "simple_exp",
          "rhs": {
            "type": "factor",
            "value": "y"
          }
        },
        "type": "simple_exp",
        "rhs": {
          "type": "factor",
          "value": "z"
        }
      }
    },
    {
      "test": {
        "op": "<",
        "lhs": {
          "type": "factor",
          "value": "z"
        },
        "type": "exp",
        "rhs": {
          "type": "factor",
          "value": "8"
        }
      },
      "else": {
        "children": [
          {
            "identifier": "b",
            "type": "read"
          },
          {
            "test": {
              "op": "=",
              "lhs": {
                "type": "factor",
                "value": "b"
              },
              "type": "exp",
              "rhs": {
                "type": "factor",
                "value": "1"
              }
            },
            "else": {
              "children": [
                {
                  "type": "write",
                  "exp": {
                    "type": "factor",
                    "value": "a"
                  }
                }
              ],
              "type": "stmt_sequence"
            },
            "then": {
              "children": [
                {
                  "type": "write",
                  "exp": {
                    "op": "*",
                    "lhs": {
                      "type": "factor",
                      "value": "b"
                    },
                    "type": "term",
                    "rhs": {
                      "type": "factor",
                      "value": {
                        "op": "-",
                        "lhs": {
                          "type": "factor",
                          "value": "x"
                        },
                        "type": "simple_exp",
                        "rhs": {
                          "type": "factor",
                          "value": "y"
                        }
                      }
                    }
                  }
                }
              ],
              "type": "stmt_sequence"
            },
            "type": "if"
          }
        ],
        "type": "stmt_sequence"
      },
      "then": {
        "children": [
          {
            "test": {
              "op": "=",
              "lhs": {
                "type": "factor",
                "value": "z"
              },
              "type": "exp",
              "rhs": {
                "type": "factor",
                "value": "0"
              }
            },
            "type": "repeat",
            "body": {
              "children": [
                {
                  "identifier": "a",
                  "type": "assign",
                  "exp": {
                    "op": "*",
                    "lhs": {
                      "type": "factor",
                      "value": "a"
                    },
                    "type": "term",
                    "rhs": {
                      "type": "factor",
                      "value": "2"
                    }
                  }
                },
                {
                  "identifier": "z",
                  "type": "assign",
                  "exp": {
                    "op": "-",
                    "lhs": {
                      "type": "factor",
                      "value": "z"
                    },
                    "type": "simple_exp",
                    "rhs": {
                      "type": "factor",
                      "value": "1"
                    }
                  }
                }
              ],
              "type": "stmt_sequence"
            }
          },
          {
            "type": "write",
            "exp": {
              "type": "factor",
              "value": "a"
            }
          }
        ],
        "type": "stmt_sequence"
      },
      "type": "if"
    },
    {
      "type": "write",
      "exp": {
        "type": "factor",
        "value": "z"
      }
    }
  ],
  "type": "stmt_sequence"
}