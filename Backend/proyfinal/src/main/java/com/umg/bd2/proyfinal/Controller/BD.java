package com.umg.bd2.proyfinal.Controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.boot.autoconfigure.graphql.data.GraphQlReactiveQueryByExampleAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

class QueryInterface{
	public String user;
	public String password;
	public String sql;
}

@RestController
public class BD {

	public String ResultSetToJSON(ResultSet resultSet) {
		JSONArray result = new JSONArray();
		try {
			ResultSetMetaData md = resultSet.getMetaData();
			int numCols = md.getColumnCount();
			List<String> colNames = IntStream.range(0, numCols)
			  .mapToObj(i -> {
			      try {
			          return md.getColumnName(i + 1);
			      } catch (SQLException e) {
			          e.printStackTrace();
			          return "?";
			      }
			  })
			  .collect(Collectors.toList());
	
			
			while (resultSet.next()) {
			    JSONObject row = new JSONObject();
			    colNames.forEach(cn -> {
			        try {
			            row.put(cn, resultSet.getObject(cn));
			        } catch (JSONException | SQLException e) {
			            e.printStackTrace();
			        }
			    });
			    result.put(row);
		}
		} catch(Exception ex) {
			System.out.println(ex);
		}
		return result.toString();
	}
	
	public String dbUrl() {

		return "jdbc:mysql://proy-final-bd2.c4pj0q0xq7tj.us-east-1.rds.amazonaws.com:3306/testdb?allowMultiQueries=true";
	}

	public String errorToJSON(Exception e) {
		return "{\"Status\" : \"error\", \"ResultSet\" : \""+e+"\"}";
	}
	
	public String SucessToJSON() {
		return "{\"Status\" : \"Sucessfull\"}";
	}
	
	public String SucessToJSON(ResultSet resultSet) {
		return "{\"Status\" : \"Sucessfull\", \"ResultSet\":"+ ResultSetToJSON(resultSet) +"}";
	}
	
	
	@CrossOrigin
	@PostMapping(value="/login")
	public String login(@RequestBody QueryInterface query) {
		String rsString="";
		try {
			Class.forName("com.mysql.cj.jdbc.Driver"); 
			DriverManager.getConnection(dbUrl(),query.user, query.password);
			rsString=SucessToJSON();
		} catch (Exception ex) {
			String error=errorToJSON(ex);
			System.out.println("Log: "+error);
			return error;
		}
		System.out.println("Log"+rsString);
		return rsString;
	}
	
	@CrossOrigin
	@PostMapping(value="/execute")
	public String execute(@RequestBody QueryInterface query) {
		String rsString="";
		try {
			System.out.println("Log "+ query.sql);
			Class.forName("com.mysql.cj.jdbc.Driver"); 
			Connection con = DriverManager.getConnection(dbUrl(),query.user,query.password);
			Statement  stmt = con.createStatement();
			boolean result = stmt.execute(query.sql);
			if (result) rsString = SucessToJSON(stmt.getResultSet());
			else rsString = SucessToJSON();
			stmt.close();
		} catch (Exception ex) {
			String error=errorToJSON(ex);
			System.out.println("Log: "+error);
			return error;
		}
		System.out.println("Log "+rsString);
		return rsString;
	}
	
	
}