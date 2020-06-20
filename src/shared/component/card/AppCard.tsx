import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { cardStyles } from "./app-card.style";

interface Props {
  id?: string;
  title: string;
  action?: any;
  style: any;
  content?: React.ReactElement;
  selection?: any;
}

const AppCard: React.FC<Props> = (props: Props) => {
  const classes = cardStyles();
  return (
    <Card id={props.id} variant="outlined" style={{ ...props.style }}>
      <div className={classes.header}>
        {props.selection}
        <div>{props.title}</div>
      </div>
      <CardContent
        className={classes.content}
        style={{ ...props.style.content }}
      >
        {props.content}
      </CardContent>
    </Card>
  );
};

export default AppCard;
