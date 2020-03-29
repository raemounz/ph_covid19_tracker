import React from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { cardStyles } from "./app-card.style";

interface Props {
  id?: string;
  title: string;
  action?: any;
  style: any;
  content?: React.ReactElement;
}

const AppCard: React.FC<Props> = (props: Props) => {
  const classes = cardStyles();
  return (
    <Card id={props.id} variant="outlined" style={{ ...props.style }}>
      <CardHeader
        title={props.title}
        titleTypographyProps={{ variant: "subtitle1" }}
        action={props.action}
      ></CardHeader>
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
