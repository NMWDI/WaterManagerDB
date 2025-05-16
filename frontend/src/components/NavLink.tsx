import { Grid, SvgIconProps } from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import { Link } from "react-router-dom";

export const NavLink = ({
  route,
  label,
  Icon,
}: {
  route: string;
  label: string;
  Icon?: React.ComponentType<SvgIconProps>;
}) => {
  return (
    <Grid item>
      <Link
        to={route}
        className={`navbar-link ${location.pathname == route ? "navbar-link-active" : ""}`}
      >
        {Icon ? (
          <Icon sx={{ fontSize: "20px", marginRight: "5px" }} />
        ) : (
          <TableViewIcon sx={{ fontSize: "20px", marginRight: "5px" }} />
        )}
        <div style={{ fontSize: "16px" }}>{label}</div>
      </Link>
    </Grid>
  );
};
