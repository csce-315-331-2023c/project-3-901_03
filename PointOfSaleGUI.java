import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.*;
import javax.swing.JScrollPane;
import java.util.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.lang.Math;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;

/**
 * 
 * This class contains all of the the swing code necessary to generate all of
 * the
 * GUI and . It has three main ActionListener blocks used to take in user input
 * as
 * well as generate necessary output for relevant SQL functions.
 * 
 * @author Caroline Jia, Mahika Peri, Sarah Ahmed, Maggie Sturm
 * @version %I%, %G%
 */
public class PointOfSaleGUI extends JFrame {
    /**
     * orderList contains all the orders for the display
     */
    private DefaultListModel<String> orderList = new DefaultListModel<>();
    /**
     * orderListDisplay contains all the orders for the display
     */
    private JList<String> orderListDisplay = new JList<>(orderList);
    /**
     * total contains the total of all the orders for the display
     */ 
    private double total = 0.0;

    /** 
     * cardLayout allows the user to choose a different layout when sharing the same screen
    */
    private CardLayout cardLayout;
    
    /**
     * cardPanel uses cardLayout as input to create a class for switching layouts
     */
    private JPanel cardPanel;
    
     /**
     * loginScreen allows the programmer to create a panel specifically created for a login page
     */
    private JPanel loginScreen;
    
    /**
     * posScreen is the JPanel that contains the createOrderingScreen panel 
     * returned from the createOrderingScreen function
     */
    private JPanel posScreen;
    
    /**
     * managingScreen is the JPanel that contains the createManagingScreen panel 
     * returned from the createManagingScreen function
     */
    private JPanel managingScreen;
    
    /**
     * inventoryScreen is the JPanel that contains the createInventoryScreen panel 
     * returned from the createInventoryScreen function
     */
    private JPanel inventoryScreen;
    
     /**
     * orderHistoryScreen stores the panel created via the return from createOrderHistoryScreen
     */
    private JPanel orderHistoryScreen;
    
    /**
     * salesReportScreen stores the panel created via the return from createSalesReportScreen
     */
    private JPanel salesReportScreen;

     /**
     * restockReportScreen stores the panel created via the return from createRestockReportScreen 
     */
    private JPanel restockReportScreen;

    /**
     * orderedTogetherScreen is the JPanel that contains the createOrderedTogetherScreen panel 
     * returned from the createOrderedTogetherScreen function
     */
    private JPanel orderedTogetherScreen;

    /**
     * inventorySelectScreen is the JPanel that contains the createSelectScreen panel 
     * returned from the createSelectScreen function
     */
    private JPanel inventorySelectScreen;

    /**
     * productReportScreen is the JPanel that contains the createProductReportScreen panel 
     * returned from the createProductReportScreen function
     */
    private JPanel productReportScreen;

    /**
     * excessReportScreen stores the panel created via the return from createExcessReportScreen
     */
    private JPanel excessReportScreen;

    private JPanel viewMenuScreen;

    /**
     * valueIsSelected is the boolean contains the whether the item on the current order 
     * in the cashier GUI is going to be deleted from the order
     */
    boolean valueIsSelected = false;

    /**
     * toBeDeleted is the string contains the name of the item on the current order 
     * in the cashier GUI that is going to be deleted from the order
     */
    String toBeDeleted = "";

    /**
     * 
     * This function runs all of the the swing code necessary to generate all of the
     * cashier GUI. It has three main ActionListener blocks used to take in user
     * input as
     * well as generate
     * necessary output for relevant SQL functions.
     */
    public PointOfSaleGUI() {
        // Formatting
        setTitle("Point of Sale");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // Create a CardLayout for switching between screens and adding screens
        cardLayout = new CardLayout();
        cardPanel = new JPanel(cardLayout);
        loginScreen = createLoginScreen();
        posScreen = createOrderingScreen();
        managingScreen = createManagingScreen();
        
        // Adding Screens
        cardPanel.add(loginScreen, "login");
        cardPanel.add(posScreen, "pos");
        cardPanel.add(managingScreen, "managing");
        //cardPanel.add(viewMenuScreen, "menu");
        //cardPanel.add(inventoryScreen, "inventory");
        //cardPanel.add(orderHistoryScreen, "order");
        //cardPanel.add(restockReportScreen, "restock");

        add(cardPanel, BorderLayout.CENTER);

        // Formatting
        pack();
        setLocationRelativeTo(null);

    }

    /**
     *
     * This function creates the ordering screen that contains a list holding the items of the current order
     * as well as the menu item buttons. It serves as the main interface for the cashier and can submit orders.
     * @return Order Screen
     */
    private JPanel createOrderingScreen() {
        // Formatting
        setTitle("Point of Sale");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        JPanel leftPanel = new JPanel();
        leftPanel.setLayout(new BorderLayout());

        Vector<String> orderSubmit = new Vector<>();
        Vector<String> menuItemsList = getMenuItems();

        // Creating Order Display
        orderListDisplay.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        JScrollPane scrollPane = new JScrollPane(orderListDisplay);
        leftPanel.add(scrollPane, BorderLayout.CENTER);

        // Creating Order Submit Button
        JPanel buttonPanel = new JPanel(new BorderLayout());
        JLabel totalLabel = new JLabel("$0.00");
        JButton submitButton = new JButton("Submit Order");
        Vector<Object> orderSubmitData = new Vector<>();
        Vector<Double> orderPriceData = new Vector<>();
        Vector<String> seasonalItems = new Vector<>();
        submitButton.addActionListener(new ActionListener() {
            @Override
            /*********************************************************/
            public void actionPerformed(ActionEvent e) {
                // Add item name to the items submitted and the price
                for (int i = 0; i < orderList.size(); i++) {
                    orderSubmitData.add(orderList.getElementAt(i));
                }
                orderSubmitData.add((int) total);

                for (int i = 0; i < orderSubmit.size(); i++) {
                    subtractFromInventory(getIngredientsFromItem(orderSubmit.get(i)));
                }

                // get current date
                LocalDate date = LocalDate.now();
                DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                String curr_date = date.format(dtf);

                // get current time
                LocalTime time = LocalTime.now();
                DateTimeFormatter ttf = DateTimeFormatter.ofPattern("HH:mm:ss");
                String curr_time = time.format(ttf);

                int randstatus = (int) (Math.random() * 2) + 1;
                String dine_in = "";
                int cashier_id = (int) (Math.random() * 10) + 1;
                if (randstatus == 1) {
                    dine_in = "Yes";
                } else {
                    dine_in = "No";
                }

                // SQL Query to submit order
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(m.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }

                String order = "";
                try {
                    // create a statement object
                    Statement stmt = conn.createStatement();

                    // create a SQL statement
                    String sqlStatement = "SELECT order_num FROM orders ORDER BY order_num DESC LIMIT 1";

                    // send statement to DBMS
                    ResultSet result = stmt.executeQuery(sqlStatement);

                    while (result.next()) {
                        order += result.getString("order_num");
                    }
                } catch (Exception m) {

                }

                long order1 = Long.parseLong(order) + 1;

                for (int i = 0; i < orderSubmit.size(); i++) {
                    String order_item = orderSubmit.get(i);
                    Double order_price = orderPriceData.get(i);
                    updateOrderHistory(order1, order_item, order_price, dine_in, cashier_id, curr_time, curr_date);
                    order1 += 1;
                }
                // Reset the order display
                orderList.clear();
                total = 0.0;
                totalLabel.setText("$0.00");
            }
        });

        buttonPanel.add(submitButton, BorderLayout.WEST);

        // Delete Button
        JButton deleteButton = new JButton("Delete Item");
        JPanel totalPanel = new JPanel();
        totalPanel.setLayout(new FlowLayout());
        totalPanel.add(new JLabel("Total: "));

        orderListDisplay.addListSelectionListener(new ListSelectionListener() {
            @Override
            public void valueChanged(ListSelectionEvent e) {
                if (!e.getValueIsAdjusting()) {
                    valueIsSelected = true;
                    toBeDeleted = orderListDisplay.getSelectedValue();
                }
            }
        });

        deleteButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

                // Delete the most recently added item from the order
                int selectedIndex = 0;
                if(valueIsSelected) {
                    for(int i =0; i < orderList.size(); i++){
                        if(orderList.getElementAt(i).equals(toBeDeleted)){
                            selectedIndex=i;
                        }
                    }

                    String selectedItem = orderList.getElementAt(selectedIndex);
                    String[] parts = selectedItem.split(" - \\$");
                    if (parts.length == 2) {
                        double itemPrice = Double.parseDouble(parts[1]);
                        total -= itemPrice;
                        orderList.removeElementAt(selectedIndex);
                        totalLabel.setText("$" + String.format("%.2f", total));
                    }

                    if (selectedIndex == 0) {
                        total = 0;
                        totalLabel.setText("$0.00");
                    }
                }
                
                orderSubmit.removeElementAt(selectedIndex);
                orderPriceData.removeElementAt(selectedIndex);
            }
        });
        // Formatting leftPanel
        buttonPanel.add(deleteButton, BorderLayout.EAST);
        totalPanel.add(totalLabel);
        buttonPanel.add(totalPanel, BorderLayout.CENTER);
        leftPanel.add(buttonPanel, BorderLayout.SOUTH);

        JPanel rightPanel = new JPanel();
        rightPanel.setLayout(new GridLayout(7, 3));
        String[] menuArray = new String[menuItemsList.size() / 2];
        double[] priceArray = new double[menuItemsList.size() / 2];

        for (int i = 0; i < menuItemsList.size() / 2; i++) {
            menuArray[i] = menuItemsList.get(i);
            priceArray[i] = Double.valueOf(menuItemsList.get(i + menuItemsList.size() / 2));
        }

        Connection conn = null;
        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception m) {
            m.printStackTrace();
            System.err.println(m.getClass().getName() + ": " + m.getMessage());
            System.exit(0);
        }

        String order = "";
        
        try {
            // create a statement object
            Statement stmt = conn.createStatement();
            String seasonalSql = "SELECT food_name FROM food_item WHERE menu_type = 'Seasonal Item'";
            ResultSet seasonalResult = stmt.executeQuery(seasonalSql);
            while(seasonalResult.next()){
                seasonalItems.add(seasonalResult.getString("food_name"));
            }
        } catch (Exception m) {

        }
        
        // Generate all the order buttons from the list
        for (String itemName : menuArray) {
            JButton itemButton = new JButton(itemName);
            for(int i = 0; i < seasonalItems.size(); i++){
                if(itemName.equals(seasonalItems.get(i))){
                    itemButton.setForeground(Color.RED);
                }
            }
            // Individual Item Buttons
            itemButton.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    // Add the selected item to the order
                    String selectedItem = e.getActionCommand();
                    int foundIndex = 0;
                    for (int i = 0; i < menuArray.length; i++) {
                        if (menuArray[i] == selectedItem) {
                            foundIndex = i;
                        }
                    }
                    double itemPrice = priceArray[foundIndex];
                    total += itemPrice;
                    orderSubmit.add(selectedItem);
                    orderPriceData.add(itemPrice);
                    orderList.addElement(selectedItem + " - $" + String.format("%.2f", itemPrice));
                    totalLabel.setText("$" + String.format("%.2f", total));

                }
            });
            rightPanel.add(itemButton);
        }
        JButton backButton = new JButton("Back to Login");
        //backButton.
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Switch back to the login screen
                cardLayout.show(cardPanel, "login");
            }
        });

        // Add the back button at the top
        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.add(backButton, BorderLayout.WEST);
        leftPanel.add(topPanel, BorderLayout.NORTH);

        // Formatting
        pack();
        setLocationRelativeTo(null);
        JPanel returnedPanel = new JPanel();
        returnedPanel.add(leftPanel, BorderLayout.WEST);
        returnedPanel.add(rightPanel, BorderLayout.EAST);
        return returnedPanel;
        
    }

    /**
     *
     * This function creates the login screen that the users will use to login and identify themselves. Depending
     * on the user, the login will direct them to different screens.
     * @return Login Screen
     */
    private JPanel createLoginScreen() {
        // Setup
        JPanel panel = new JPanel();
        panel.setLayout(null);
        JFrame frame = new JFrame();
        frame.setTitle("LOGIN PAGE");
        frame.setLocation(new Point(500, 300));
        frame.add(panel);
        frame.setSize(new Dimension(400, 200));
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Adding username and password formatting
        JLabel usernameLabel = new JLabel("Username:");
        usernameLabel.setBounds(100, 8, 70, 20);
        panel.add(usernameLabel);

        JTextField usernameField = new JTextField();
        usernameField.setBounds(100, 27, 193, 28);
        panel.add(usernameField);

        JLabel passwordLabel = new JLabel("Password:");
        passwordLabel.setBounds(100, 55, 70, 20);
        panel.add(passwordLabel);

        JPasswordField passwordField = new JPasswordField();
        passwordField.setBounds(100, 75, 193, 28);
        panel.add(passwordField);

        JButton loginButton = new JButton("Login");
        loginButton.setBounds(100, 110, 90, 25);
        panel.add(loginButton);

        // Login Button
        loginButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Check username and password
                String enteredUsername = usernameField.getText();
                char[] enteredPassword = passwordField.getPassword();

                // Replace with your authentication logic
                if ("Cashier".equals(enteredUsername) && "password".equals(new String(enteredPassword))) {
                    cardLayout.show(cardPanel, "pos"); // Switch to the Point of Sale screen
                } else if ("Manager".equals(enteredUsername) && "password".equals(new String(enteredPassword))) {
                    cardLayout.show(cardPanel, "managing"); // Switch to the Managing screen
                } else if ("Inventory".equals(enteredUsername) && "password".equals(new String(enteredPassword))) {
                    cardLayout.show(cardPanel, "inventory"); // Switch to the Inventory screen
                } else {
                    JOptionPane.showMessageDialog(panel, "Invalid username or password", "Login Failed",
                            JOptionPane.ERROR_MESSAGE);
                }

                // Clear the password field
                passwordField.setText("");
                usernameField.setText("");
            }
        });

        // Formatting
        panel.add(usernameLabel);
        panel.add(usernameField);
        panel.add(passwordLabel);
        panel.add(passwordField);
        panel.add(loginButton);
        pack();
        setLocationRelativeTo(null); // Center the window
        return panel;
    }

    /**
     *
     * This function creates the managing screen that the managers will use to check and update the inventory.
     * the managing screen also has the ability to review different report based off of inventory activity and
     * order history
     * @return Managing Screen
     */
    private JPanel createManagingScreen() {
        // Setup
        JPanel returnPanel = new JPanel();
        JPanel menuPanel = new JPanel();
        JPanel inventoryPanel = new JPanel();
        JPanel reportPanel = new JPanel();
        setLayout(new FlowLayout());

        JButton addMenuItemButton = new JButton("Add Menu Item");
        JButton deleteMenuItemButton = new JButton("Delete Menu Item");
        JButton updatePriceButton = new JButton("Update Menu Item - Price");
        JButton updateNameButton = new JButton("Update Menu Item - Name");
        //JButton refreshButton = new JButton("Refresh");
        JButton backButton = new JButton("Back to Login");
        //backButton.
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Switch back to the login screen
                cardLayout.show(cardPanel, "login");
            }
        });
        returnPanel.add(backButton, BorderLayout.SOUTH);


        addMenuItemButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Getting values to add new Menu Item
                String itemName = JOptionPane.showInputDialog("Enter the item name:");
                double itemPrice = Double.parseDouble(JOptionPane.showInputDialog("Enter the item price:"));
                //String menuType = JOptionPane.showInputDialog("Enter the menu type: (Sweet Crepe, Savory Crepe, Breakfast, Drink)");
                //String menuTime = JOptionPane.showInputDialog("Enter the menu time: (All Day, Breakfast)");
                String[] choices = {"Select", "Sweet Crepe", "Savory Crepe", "Breakfast", "Drink", "Seasonal Item"};
                String menuType = (String) JOptionPane.showInputDialog(null, "Select the menu types: ", null, JOptionPane.QUESTION_MESSAGE, null, choices, choices[0]);
                if (menuType == "Select") {
                    menuType = (String) JOptionPane.showInputDialog(null, "Error: Select the menu type: ", null, JOptionPane.QUESTION_MESSAGE, null, choices, choices[0]);
                }

                String[] choices2 = {"Select", "All Day", "Breakfast"};
                String menuTime = (String) JOptionPane.showInputDialog(null, "Select the menu time: ", null, JOptionPane.QUESTION_MESSAGE, null, choices2, choices2[0]);
                if (menuTime == "Select") {
                    menuType = (String) JOptionPane.showInputDialog(null, "Error: Select the menu time: ", null, JOptionPane.QUESTION_MESSAGE, null, choices2, choices2[0]);
                }
                // SQL code to run query
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(m.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }

                try {
                    Statement stmt = conn.createStatement();
                    String addingFood = String.format("INSERT INTO food_item (price_food, food_name, menu_type, menu_time) VALUES (%s, '%s', '%s', '%s')",
                    itemPrice, itemName, menuType, menuTime);
                    stmt.executeQuery(addingFood);

                } catch (Exception m) {
                   
                }

                inventorySelectScreen = createSelectScreen(itemName);
                cardPanel.add(inventorySelectScreen, "select");
                cardLayout.show(cardPanel, "select");

            }
        });

        deleteMenuItemButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Getting name to delete Menu Item
                String itemName = JOptionPane.showInputDialog("Enter the item name to delete:");

                // SQL code to run query
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(e.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }

                try {
                    // create a statement object
                    Statement stmt = conn.createStatement();
                    // create a SQL statement
                    String sqlStatement = "DELETE FROM food_item WHERE food_name = '" + itemName + "'";
                    // send statement to DBMS
                    ResultSet result = stmt.executeQuery(sqlStatement);
                } catch (Exception m) {

                }
            }
        });

        updatePriceButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Getting values to update Menu Item Price
                String menu_item = JOptionPane.showInputDialog("Enter the item name to update price:");
                double newPrice = Double.parseDouble(JOptionPane.showInputDialog("Enter the new price:"));

                // SQL code to run query
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(e.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }

                try {
                    // create a statement object
                    Statement stmt = conn.createStatement();
                    // create a SQL statement
                    String sqlStatement = "UPDATE food_item SET price_food = " + newPrice + " WHERE food_name = '"
                            + menu_item + "'";
                    // send statement to DBMS
                    ResultSet result = stmt.executeQuery(sqlStatement);
                } catch (Exception m) {

                }
            }
        });

        updateNameButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Getting values to update Manu Item name
                String itemName = JOptionPane.showInputDialog("Enter the item name to update:");
                String newName = JOptionPane.showInputDialog("Enter the new name:");

                // SQL code to run query
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(m.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }

                try {
                    Statement stmt = conn.createStatement();
                    String updatedFood = String.format("UPDATE food_item SET food_name = '%s' WHERE food_name = '%s';",
                            newName, itemName);
                    stmt.executeQuery(updatedFood);

                } catch (Exception m) {

                }
            }
        });

        // Menu Button Formatting
        //menuPanel.add(refreshButton);
        menuPanel.add(addMenuItemButton);
        menuPanel.add(deleteMenuItemButton);
        menuPanel.add(updatePriceButton);
        menuPanel.add(updateNameButton);

        JButton viewMenuButton = new JButton("View Menu Items");
        JButton addIngredientButton = new JButton("Add Ingredient");
        JButton deleteIngredientButton = new JButton("Delete Ingredient");
        JButton updateIngredientQuantityButton = new JButton("Update Ingredient - Quantity");
        JButton updateIngredientNameButton = new JButton("Update Ingredient - Name");

        viewMenuButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // SQL code to run query
                viewMenuScreen = createMenuItemScreen();
                cardPanel.add(viewMenuScreen, "menu");
                cardLayout.show(cardPanel, "menu");
            }
        });

        addIngredientButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Getting values for adding new Ingredient
                String name = JOptionPane.showInputDialog("Enter the ingredient name: (lowercase)");
                int quantity = Integer.parseInt(JOptionPane.showInputDialog("Enter the quantity:"));
                double batch_cost = Double.parseDouble(JOptionPane.showInputDialog("Enter the ingredient price:"));
                String day_bought = JOptionPane.showInputDialog("Enter the day it was bought: (YYYY-MM-DD)");
                String day_bad = JOptionPane.showInputDialog("Enter the day it goes bad: (YYYY-MM-DD)");
                String[] choices = {"Select", "Fridge", "Pantry"};
                String storage_method = (String) JOptionPane.showInputDialog(null, "Select the storage method:", null, JOptionPane.QUESTION_MESSAGE, null, choices, choices[0]);
                if (storage_method == "Select") {
                    storage_method = (String) JOptionPane.showInputDialog(null, "Error:Select the storage method:", null, JOptionPane.QUESTION_MESSAGE, null, choices, choices[0]);
                }
                String insertInventory = String.format("INSERT INTO inventory VALUES ('%s',%s,%s,'%s','%s','%s',%s);",
                        name, quantity, batch_cost, day_bought, day_bad, storage_method,20);

                // SQL code to run query
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(m.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }
                try {
                    Statement stmt = conn.createStatement();
                    stmt.executeQuery(insertInventory);
                } catch (Exception m) {

                }
            }
        });

        deleteIngredientButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Getting value to delete inventory item
                String itemName = JOptionPane.showInputDialog("Enter the item name to delete:");
                String deleteInventory = String.format("DELETE FROM inventory WHERE ingred_name='%s';", itemName);

                // SQL code to run query
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(m.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }
                try {
                    Statement stmt = conn.createStatement();
                    ResultSet result = stmt.executeQuery(deleteInventory);
                } catch (Exception m) {

                }
            }
        });

        updateIngredientQuantityButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Getting values to upate ingredient quantity
                String ingredient = JOptionPane.showInputDialog("Enter the ingredient to update quantity:");
                int quantity = Integer.parseInt(JOptionPane.showInputDialog("Enter the new quantity:"));

                // SQL code to run query
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(m.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }

                try {
                    // create a statement object
                    Statement stmt = conn.createStatement();
                    // create a SQL statement
                    String sqlStatement = "UPDATE inventory SET quantity = " + quantity + " WHERE ingred_name = '"
                            + ingredient + "'";
                    // send statement to DBMS
                    ResultSet result = stmt.executeQuery(sqlStatement);
                } catch (Exception m) {

                }
            }
        });

        updateIngredientNameButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Getting values of upate ingredient name
                String oldName = JOptionPane.showInputDialog("Enter old ingredient name:");
                String newName = JOptionPane.showInputDialog("Enter new ingredient name (lowercase):");

                // SQL code to run query
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(e.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }

                try {
                    // create a statement object
                    Statement stmt = conn.createStatement();
                    // create a SQL statement
                    String sqlStatement = "UPDATE inventory SET ingred_name = '" + newName + "' WHERE ingred_name = '"+ oldName + "'";
                    // send statement to DBMS
                    ResultSet result = stmt.executeQuery(sqlStatement);
                } catch (Exception m) {

                }

            }
        });

        // creating the inventory buttons panel
        inventoryPanel.add(viewMenuButton);
        inventoryPanel.add(addIngredientButton);
        inventoryPanel.add(deleteIngredientButton);
        inventoryPanel.add(updateIngredientQuantityButton);
        inventoryPanel.add(updateIngredientNameButton);

        JButton displayOrderHistory = new JButton("View Order History");
        JButton salesReportButton = new JButton("View Sales Report");
        JButton restockReportButton = new JButton("View Restock Report");
        JButton orderTogetherButton = new JButton("View Ordered Together Report");
        JButton productReportButton = new JButton("View Product Sales Report");
        JButton excessReportButton = new JButton("View Excess Report");

        displayOrderHistory.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                orderHistoryScreen = createOrderHistoryScreen();
                cardPanel.add(orderHistoryScreen, "order");
                cardLayout.show(cardPanel, "order");
            }
        });

        //NEEDS BACK
        salesReportButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String startDate = JOptionPane.showInputDialog("Enter the starting date: (YYYY-MM-DD)");
                String endDate = JOptionPane.showInputDialog("Enter the ending date: (YYYY-MM-DD)");
                salesReportScreen = createSalesReportScreen(startDate, endDate);

                cardPanel.add(salesReportScreen, "sales");
                cardLayout.show(cardPanel, "sales");
            }
        });

        //NEEDS BACK
        productReportButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String startDate = JOptionPane.showInputDialog("Enter the starting date: (YYYY-MM-DD)");
                String endDate = JOptionPane.showInputDialog("Enter the ending date: (YYYY-MM-DD)");
                productReportScreen = createProductReportScreen(startDate, endDate);

                cardPanel.add(productReportScreen, "product usage");
                cardLayout.show(cardPanel, "product usage");
            }

        });

        //NEEDS BACK
        restockReportButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int minimum = Integer.parseInt(JOptionPane.showInputDialog("Enter the minimum quantity: "));
                restockReportScreen = createRestockScreen(minimum);
                cardPanel.add(restockReportScreen, "restock");
                cardLayout.show(cardPanel, "restock");
            }
        });

        //NEEDS BACK
        orderTogetherButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String userDate = JOptionPane.showInputDialog("Enter the month to parse through using YYYY-MM-DD: ");
                orderedTogetherScreen = createOrderedTogetherScreen(userDate);

                cardPanel.add(orderedTogetherScreen, "pairs");
                cardLayout.show(cardPanel, "pairs");
            }
        });

        excessReportButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String startDate = JOptionPane.showInputDialog("Enter the start date (YYYY-MM-DD): ");
                excessReportScreen = createExcessReportScreen(startDate);

                cardPanel.add(excessReportScreen, "excess");
                cardLayout.show(cardPanel, "excess");
            }
        });
        
        JButton refreshButton = new JButton("Refresh");
        
        refreshButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                JPanel returnPanel = createManagingScreen();
                JPanel newInventoryLayout = createInventoryScreen();
                returnPanel.add(newInventoryLayout);
                cardPanel.add(returnPanel, "refresh");
                cardLayout.show(cardPanel, "refresh");
            }
        });

        reportPanel.add(displayOrderHistory);
        reportPanel.add(salesReportButton);
        reportPanel.add(restockReportButton);
        reportPanel.add(orderTogetherButton);
        reportPanel.add(productReportButton);
        reportPanel.add(excessReportButton);

        // Panel for displaying current inventory
        JPanel inventreturnPanel;
        inventreturnPanel = createInventoryScreen();
        cardPanel.add(inventreturnPanel, "inventory");
        cardLayout.show(cardPanel, "inventory");

        // adding all elements of the managing screen
        returnPanel.add(menuPanel, BorderLayout.NORTH);
        returnPanel.add(inventoryPanel, BorderLayout.NORTH);
        returnPanel.add(reportPanel, BorderLayout.SOUTH);
        returnPanel.add(refreshButton);
        returnPanel.add(inventreturnPanel);
        returnPanel.setPreferredSize(new Dimension(800, 800));
        return returnPanel;
    }
    
    /**
     *
     * This function creates the inventory screen that the managers will use to view the status of the inventory.
     * @return Inventory Screen
     */
    private JPanel createInventoryScreen() {
        JPanel inventreturnPanel = new JPanel();

        // SQL code to run query
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }
        String name = "";
        try {
            // create a statement object
            Statement stmt = conn.createStatement();
            // create a SQL statement
            String sqlStatement = "SELECT ingred_name, quantity FROM inventory ORDER BY ingred_name ASC;";
            // send statement to DBMS
            ResultSet result = stmt.executeQuery(sqlStatement);
            while (result.next()) {
                name += result.getString("ingred_name") + " " + result.getString("quantity") + "\n";
            }
        } catch (Exception e) {
            
        }
        
        JTextArea inventoryList = new JTextArea(name);
        JScrollPane scrollPane = new JScrollPane(inventoryList);
        scrollPane.setPreferredSize(new Dimension(800, 600));
        scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
        scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        inventreturnPanel.add(scrollPane);

        inventreturnPanel.setPreferredSize(new Dimension(800,600));
        pack();
        
        return inventreturnPanel;
    }

    private JPanel createMenuItemScreen() {
        JPanel menuReturnPanel = new JPanel();
        JButton backButton = new JButton("Back to Manager View");
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Switch back to the login screen
                cardLayout.show(cardPanel, "managing");
            }
        });
        menuReturnPanel.add(backButton);

        Connection conn = null;
        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }
        String name = "";
        try {
            // create a statement object
            Statement stmt = conn.createStatement();
            // create a SQL statement
            String sqlStatement = "SELECT menu_num, food_name, price_food FROM food_item ORDER BY menu_num ASC;";
            // send statement to DBMS
            ResultSet result = stmt.executeQuery(sqlStatement);
            while (result.next()) {
                name += result.getString("menu_num") + " " + result.getString("food_name") + " " + result.getString("price_food") + "\n";
            }
            } catch (Exception e) {
                
            }
            
            JTextArea menuList = new JTextArea(name);
            JScrollPane scrollPane = new JScrollPane(menuList);
            scrollPane.setPreferredSize(new Dimension(800, 600));
            scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
            scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
            menuReturnPanel.add(scrollPane);

            menuReturnPanel.setPreferredSize(new Dimension(800,600));
            pack();

            return menuReturnPanel;
    }

    /**
     *
     * This function creates the managing screen that the managers will use to check and update the inventory.
     * the managing screen also has the ability to review different report based off of inventory activity and
     * order history
     * @return OrderHistory Screen
     */
    private JPanel createOrderHistoryScreen() {
        JPanel orderReturnPanel = new JPanel();
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception m) {
            m.printStackTrace();
            System.err.println(m.getClass().getName() + ": " + m.getMessage());
            System.exit(0);
        }
        String name = "";
        try {
            // create a statement object
            Statement stmt = conn.createStatement();
            // create a SQL statement
            String sqlStatement = "SELECT order_num, order_item, order_price, order_time, order_date, dine_in, cashier_id FROM orders ORDER BY order_num DESC LIMIT 50";
            // send statement to DBMS
            ResultSet result = stmt.executeQuery(sqlStatement);
            while (result.next()) {
                name += result.getString("order_num") + " " + result.getString("order_item") + " "
                        + result.getString("order_price") + " " + result.getString("order_time") + " "
                        + result.getString("order_date") + " " + result.getString("dine_in") + " "
                        + result.getString("cashier_id") + "\n";
            }
        } catch (Exception m) {

        }
        JButton backButton = new JButton("Back to Manager View");
        //backButton.
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Switch back to the login screen
                cardLayout.show(cardPanel, "managing");
            }
        });
        orderReturnPanel.add(backButton, BorderLayout.SOUTH);

        // formatting for orderHistory List
        JTextArea orderList = new JTextArea(name);
        orderList.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(orderList);
        scrollPane.setPreferredSize(new Dimension(800, 600));
        scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
        scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        orderReturnPanel.add(scrollPane);

        return orderReturnPanel;
    }

    /**
     * This function returns the screen of a 
     * time window and displays a table that depicts the amount of inventory 
     * used during that time period.
     * The start date and end date must be structured as 
     * YYYY-MM-DD is placed into the SQL query.
     * This function has the ability to create a new panel and 
     * creates a scrollable screen to view all the values of the inventory.
     *
     * @param  start                the start date to begin the inventory count
     * @param  end                  the end date to end the inventory count
     * @return productReturnPanel   a table of the inventory item and how much was used
     */
    private JPanel createProductReportScreen(String start, String end) {
        JPanel productReturnPanel = new JPanel();
        JButton backButton = new JButton("Back to Manager View");
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Switch back to the login screen
                cardLayout.show(cardPanel, "managing");
            }
        });
        productReturnPanel.add(backButton);
        Connection conn = null;
            //TODO STEP 1
            try {
                conn = DriverManager.getConnection(
                "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                "csce315_901_03user",
                "90103");
            } catch (Exception m) {
                m.printStackTrace();
                System.err.println(m.getClass().getName()+": "+m.getMessage());
                System.exit(0);
            }

            String name = "Product Usage \n";
            

            try{
                //create a statement object
                Statement stmt = conn.createStatement();
                //create a SQL statement
                //TODO Step 2
                // maggie
                String sqlStatement = "SELECT i.ingred_name, COUNT(*) AS total_usage FROM orders o JOIN food_item fi ON o.order_item = fi.food_name JOIN inventory i ON i.ingred_name = ANY(fi.ingredients) WHERE o.order_date BETWEEN '" + start + "' AND '" + end + "' GROUP BY i.ingred_name;";
                //String sqlStatement = "SELECT order_item, SUM(order_price) AS item_total FROM orders WHERE order_date >= '2022-01-01' AND order_date <= '2022-01-02' GROUP BY order_item ORDER BY SUM(order_price) DESC";
                //send statement to DBMS
                ResultSet result = stmt.executeQuery(sqlStatement);

                while (result.next()) {
                    name += result.getString("ingred_name") + " " + result.getString("total_usage") + "\n";
                }
        
            } catch (Exception m){
                
            }

            // formatting for orderHistory List
            JTextArea salesList = new JTextArea(name);
            salesList.setEditable(false);
            JScrollPane scrollPane = new JScrollPane(salesList);
            scrollPane.setPreferredSize(new Dimension(800, 600));
            scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
            scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
            productReturnPanel.add(scrollPane);
            productReturnPanel.setPreferredSize(new Dimension(800, 600));
            
            return productReturnPanel;

    }

    /**
     * 
     * This function takes in two Strings that are inputted by the manager that act as the window for the sales report.
     * With the two dates, a SQL statement is used to filter the database and totals the sales for each menu item.
     *
     * It displays the results from the SQL statement in descending order by item total for that period.
     *
     * @param start, end are two Strings that are the start and end dates for the sales report period
     * @return JPanel that displays the results of the SQL statement: sales totals for each item between the inputted dates
     * in descending order
     */
    private JPanel createSalesReportScreen(String start, String end) {
        JPanel salesReturnPanel = new JPanel();
        JButton backButton = new JButton("Back to Manager View");
        //backButton.
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Switch back to the login screen
                cardLayout.show(cardPanel, "managing");
            }
        });
        salesReturnPanel.add(backButton);

        Connection conn = null;
                //TODO STEP 1
                try {
                    conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(m.getClass().getName()+": "+m.getMessage());
                    System.exit(0);
                }
                //JOptionPane.showMessageDialog(null,"Opened database successfully");

                String name = "";
                Vector<String> item = new Vector<>();
                Vector<String> total = new Vector<>();


                try{
                    //create a statement object
                    Statement stmt = conn.createStatement();
                    //create a SQL statement
                    //TODO Step 2
                    String sqlStatement = "SELECT order_item, SUM(order_price) AS item_total FROM orders WHERE order_date >= '" + start + "' AND order_date <= '" + end + "' GROUP BY order_item ORDER BY SUM(order_price) DESC";
                    //String sqlStatement = "SELECT order_item, SUM(order_price) AS item_total FROM orders WHERE order_date >= '2022-01-01' AND order_date <= '2022-01-02' GROUP BY order_item ORDER BY SUM(order_price) DESC";
                    //send statement to DBMS
                    ResultSet result = stmt.executeQuery(sqlStatement);
                    while (result.next()) {
                    name += result.getString("order_item")+ " " + result.getString("item_total") +"\n";
                    item.add(result.getString("order_item"));
                    total.add(result.getString("item_total"));
                    }
                } catch (Exception m){
                    
                }

                // formatting for orderHistory List
                JTextArea salesList = new JTextArea(name);
                salesList.setEditable(false);
                JScrollPane scrollPane = new JScrollPane(salesList);
                scrollPane.setPreferredSize(new Dimension(800, 600));
                scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
                scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
                salesReturnPanel.add(scrollPane);
                salesReturnPanel.setPreferredSize(new Dimension(800, 600));
                
                return salesReturnPanel;

    }

    /**
     * 
     * This function connects to the database to retrieve the ingredients from the inventory table whose quantities are less than the 
     * minimum amount specified in the inventory table
     *
     * It displays the results from the SQL statement in descending order by current quantity.
     *
     * @return JPanel that displays the results of the SQL statement: all inventory items that need to be restocked by least amount
     */
    private JPanel createRestockScreen(Integer min) {
        JPanel restockReturnPanel = new JPanel();
        JButton backButton = new JButton("Back to Manager View");
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Switch back to the login screen
                cardLayout.show(cardPanel, "managing");
            }
        });
        restockReturnPanel.add(backButton);

        Connection conn = null;
        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception m) {
            m.printStackTrace();
            System.err.println(m.getClass().getName() + ": " + m.getMessage());
            System.exit(0);
        }
        String name = "";
        try {
            // create a statement object
            Statement stmt = conn.createStatement();
            // create a SQL statement
            String sqlStatement = "SELECT ingred_name, quantity FROM inventory WHERE quantity <= " + min + " ORDER BY quantity ASC";
            // send statement to DBMS
            ResultSet result = stmt.executeQuery(sqlStatement);
            while (result.next()) {
                name += result.getString("ingred_name") + " " + result.getString("quantity") + "\n";
            }
        } catch (Exception m) {

        }
        // formatting for orderHistory List
        JTextArea restockList = new JTextArea(name);
        restockList.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(restockList);
        scrollPane.setPreferredSize(new Dimension(800, 600));
        scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
        scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        restockReturnPanel.add(scrollPane);

        return restockReturnPanel;
    }

    /**
    * 
    * This function contains all the necessary information to 
    * return popular pairs of menu items that sell together often
    * popular or not, sorted by most frequent.  
    * The SQl query is provided and is outputted via the Java code.
    * It creates an order display as well as buttons.
    *
    * It returns a screen that shows a table of the most frequent items 
    * ordered together, ordered by the the most frequent item,
    * randomized throughout the dates in between the given month.
    * The given date should have a YYYY-MM-01 as the input.
    *
    * @param   userDate		    the given date from the user
    * @return  pairReturnPanel     the screen with specified history 
    */
    private JPanel createOrderedTogetherScreen(String userDate) {
        JPanel pairReturnPanel = new JPanel();
        JButton backButton = new JButton("Back to Manager View");
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Switch back to the login screen
                cardLayout.show(cardPanel, "managing");
            }
        });
        pairReturnPanel.add(backButton);

        DateTimeFormatter DTF = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date_ = LocalDate.parse(userDate, DTF);
        LocalDate end_date = date_.plusDays(29);

                // SQL code to run query
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(m.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }

                String pairname = "";
                try {
                    Statement stmt = conn.createStatement();
                    String addingFood = String.format(
                            "WITH PairedItems AS ( SELECT DISTINCT\r\n" + //
                                    "        LEAST(o1.order_item, o2.order_item) AS item1,\r\n" + //
                                    "        GREATEST(o1.order_item, o2.order_item) AS item2,\r\n" + //
                                    "        o1.order_date,\r\n" + //
                                    "        o1.order_time\r\n" + //
                                    "    FROM orders o1\r\n" + //
                                    "    JOIN orders o2 ON o1.order_time = o2.order_time\r\n" + //
                                    "                 AND o1.order_date = o2.order_date\r\n" + //
                                    "                 AND o1.cashier_id = o2.cashier_id\r\n" + //
                                    "                 AND o1.order_num <> o2.order_num\r\n" + //
                                    "    WHERE o1.order_date BETWEEN '%s' AND '%s'\r\n" + //
                                    ")\r\n" + //
                                    "SELECT item1, item2, order_date, order_time\r\n" + //
                                    "FROM PairedItems\r\n" + //
                                    "ORDER BY (\r\n" + //
                                    "    SELECT COUNT(*)\r\n" + //
                                    "    FROM PairedItems AS p\r\n" + //
                                    "    WHERE item1 = p.item1 AND item2 = p.item2\r\n" + //
                                    ") DESC;\r\n" + //
                                    "",
                            date_, end_date);
                    ResultSet result = stmt.executeQuery(addingFood);
                    while (result.next()) {
                        pairname += result.getString("item1") + ", " + result.getString("item2") + " | " + result.getString("order_date") + " | " + result.getString("order_time") + "\n";
                    }

                } catch (Exception m) {
                    
                }

        // formatting for orderHistory List
                JTextArea pairsList = new JTextArea(pairname);
                pairsList.setEditable(false);
                JScrollPane scrollPane = new JScrollPane(pairsList);
                scrollPane.setPreferredSize(new Dimension(800, 600));
                scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
                scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
                pairReturnPanel.add(scrollPane);
                pairReturnPanel.setPreferredSize(new Dimension(800, 600));
                
                return pairReturnPanel;
    }

    /**
     * 
     * This function takes the name of a menu item that's being created in addMenuItemButton in the Managing screen. 
     * The function connects to the database to alphabetically create a JCheckbox for each ingredient in the inventory table
     * and adds the checkboxes to an array of checkboxes that can be iterated through later.
     *
     * Following that, it creates a submit button that iterates through the array of checkboxes and checks to see which are selected.
     * If the checkbox is selected, it gets the text/title of the checkbox and adds the corresponding ingredient to the food item table
     * as the ingredients vector for the new menu item being created. 
     * 
     * After the button is pressed, the info is submitted to the database using SQL and it returns to the manager's screen.
     *
     * @param item the name of the menu item being created
     * @return JPanel that displays checkboxes to select ingredients for said menu item
     */
    private JPanel createSelectScreen(String item) {
        JPanel selectReturnPanel = new JPanel();
        selectReturnPanel.setLayout(new GridLayout(20, 4));
        
        Vector<String> ingredients = new Vector<>();

        Connection conn = null;
        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception m) {
            m.printStackTrace();
            System.err.println(m.getClass().getName() + ": " + m.getMessage());
            System.exit(0);
        }

        try {
            // create a statement object
            Statement stmt = conn.createStatement();
            // create a SQL statement
            String sqlStatement = "SELECT ingred_name FROM inventory ORDER BY ingred_name ASC";
            // send statement to DBMS
            ResultSet result = stmt.executeQuery(sqlStatement);
            while (result.next()) {
                ingredients.add(result.getString("ingred_name"));
            }
        } catch (Exception m) {

        }

        Vector<String> selectedIngredients = new Vector<>(); //create new vector to hold all the selected ingredients
        JCheckBox[] boxes = new JCheckBox[ingredients.size()];
        int boxindex = 0; 

        for (String ingredientName : ingredients) {
            JCheckBox checkbox = new JCheckBox();
            checkbox.setText(ingredientName);
            checkbox.setSelected(false);
            selectReturnPanel.add(checkbox);
            boxes[boxindex] = checkbox;
            boxindex += 1;
        }

        JButton submitIngredientsButton = new JButton("Submit Ingredients");

        submitIngredientsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {    
                Connection conn = null;
                try {
                    conn = DriverManager.getConnection(
                            "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                            "csce315_901_03user",
                            "90103");
                } catch (Exception m) {
                    m.printStackTrace();
                    System.err.println(m.getClass().getName() + ": " + m.getMessage());
                    System.exit(0);
                }
                
                try {

                for (int j = 0; j < boxes.length; j++) {//for each box in list
                    for (int i = 0; i < ingredients.size(); i++) {//for each ingredient in inventory
                        if (boxes[j].getText() == ingredients.get(i)) {//if the box's text equals the ingredient at i's text
                            if (boxes[j].isSelected()) {//if the checkbox IS SELECTED
                                selectedIngredients.add(ingredients.get(i));
                            }
                        }
                    }
                }

                // create a statement object
                Statement stmt = conn.createStatement();
                // create a SQL statement
                String sqlStatement = "";
                for (int i = 0; i < selectedIngredients.size(); i++) {
                    if (i != selectedIngredients.size() - 1) {
                        if (i == 0) {
                            sqlStatement += "UPDATE food_item SET ingredients = '{";
                        }
                        sqlStatement += selectedIngredients.get(i) + ", ";
                    }

                    else if (i == selectedIngredients.size() - 1) {
                        sqlStatement += selectedIngredients.get(i) + "}' WHERE food_name = '" + item + "'";
                    }
                }

                // send statement to DBMS
                stmt.executeQuery(sqlStatement);
            
                
                } catch (Exception m) {

                }

                for (int i = 0; i < boxes.length; i++) {
                    boxes[i].setSelected(false);
                }
                cardLayout.show(cardPanel, "managing");
            }
        });
        

        selectReturnPanel.add(submitIngredientsButton);
        
        return selectReturnPanel;
        
    }

    /**
     * 
     * This function runs all of the the swing code necessary to 
     * generate the excess report screen which is added to a button that the manager.
     * has access to. It takes in a starting date and lists the items and their quantities
     * that sold less than 10% of their inventory from the start date to the current date.
     * 
     * @param date  the starting date given to generate the excess report screen
     * @return  the excess return panel 
     */
    private JPanel createExcessReportScreen(String date){
        JPanel excessReturnPanel = new JPanel();
        JButton backButton = new JButton("Back to Manager View");
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Switch back to the login screen
                cardLayout.show(cardPanel, "managing");
            }
        });
        excessReturnPanel.add(backButton);
        DateTimeFormatter dtfNew = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(date, dtfNew);
        //setting starting inventory item quantity at 1000
        Integer startQuantity = 100;
        Vector<String> ingredients = new Vector<>();
        Vector<Integer> quantities = new Vector<>();
        Vector<Integer> updatedQuantities = new Vector<>();
        Vector<Integer> amountSold = new Vector<>();

        // SQL code to run query
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception m) {
            m.printStackTrace();
            System.err.println(m.getClass().getName() + ": " + m.getMessage());
            System.exit(0);
        }
        String name = "";
        try {
            // create a statement object
            Statement stmt = conn.createStatement();
            // create a SQL statement
            String sqlStatement = "SELECT ingred_name, quantity FROM inventory";
            // send statement to DBMS
            ResultSet result = stmt.executeQuery(sqlStatement);
            while (result.next()) {
                name = result.getString("ingred_name");
                ingredients.add(name);
                quantities.add(startQuantity);
            }

            LocalDate ldate = LocalDate.now();
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String currDate = ldate.format(dtf);
            String sqlstmt = String.format("SELECT i.ingred_name, COUNT(*) AS total_usage FROM orders o JOIN food_item fi ON o.order_item = fi.food_name JOIN inventory i ON i.ingred_name = ANY(fi.ingredients) WHERE o.order_date BETWEEN '%s' AND '%s' GROUP BY i.ingred_name;", startDate, currDate);

            ResultSet usageResult = stmt.executeQuery(sqlstmt);
            String ingredName = "";
            String amount = "";
            Vector<String> soldIngredNames = new Vector<>();
            Vector<Integer> soldUsages = new Vector<>();
            while(usageResult.next()){
                ingredName = usageResult.getString("ingred_name");
                amount = usageResult.getString("total_usage");
                soldIngredNames.add(ingredName);
                soldUsages.add(Integer.valueOf(amount));
            }
            for(int i = 0 ; i < quantities.size(); i++){
                amountSold.add(0);
            }

            for(int i = 0; i < soldIngredNames.size(); i++){
                for(int j = 0; j < ingredients.size(); j++){
                    if(ingredients.get(j).equals(soldIngredNames.get(i))){
                        Integer usage = soldUsages.get(i);
                        Integer currQuantity = quantities.get(j) - usage;
                        
                        quantities.set(j, currQuantity);
                        amountSold.set(j, usage);
                    }
                    
                }
            }
          
        } catch (Exception m) {
            
        }

        //now calculate the inventory items that sold less than 10% of their inventory
        String text = "";
        for(int i = 0 ; i < ingredients.size(); i++){
            if(amountSold.get(i) < (0.1*startQuantity)){
                text += ingredients.get(i) + " " + Integer.toString(quantities.get(i)) + '\n';
            }
        }

        if(text.length() == 0){
            text = "No excess items in this time window \n";
        }

        JTextArea excessList = new JTextArea(text);
        excessList.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(excessList);
        scrollPane.setPreferredSize(new Dimension(800, 600));
        scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
        scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        excessReturnPanel.add(scrollPane);

        return excessReturnPanel;
    }

    /**
     * 
     * This function takes the name of a menu item and uses a SQL command to communicate with the database and retrieve the array 
     * of ingredients from its row in the table. It returns a Vector of Strings of ingredients for the subtractFromInventory function.
     * 
     * First, the function had to access the database to retrieve the length of the var char array for the ingredients of the
     * specific menu item.
     *
     * Then, the function iterates through the size of the array to retrieve each menu item ingredient and add it to a vector.
     * The vector is then returned and used as input for the subtractFromInventory function
     *
     * @param food_name the name of the menu item
     * @return Vector of Strings containing the ingredients of the menu item
     */
    public Vector<String> getIngredientsFromItem(String food_name) {
        // SQL code to run query
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }

        Vector<String> ingredients = new Vector<>();
        String ingredient = "";
        String array_size = "";

        try {
            Statement stmt = conn.createStatement();
            String sql_index = "SELECT ARRAY_LENGTH(ingredients, 1) FROM food_item WHERE food_name = '" + food_name
                    + "'";

            ResultSet indexresult = stmt.executeQuery(sql_index);

            while (indexresult.next()) {
                array_size += indexresult.getString("ARRAY_LENGTH");
            }

        } catch (Exception e) {

        }
        
        int index = Integer.valueOf(array_size);
        // get every ingredient for a specific food item, return a list of ingredients
        for (int i = 1; i <= index; i++) {
            try {
                Statement stmt = conn.createStatement();
                String sql_ingred = "SELECT ingredients[" + i + "] FROM food_item WHERE food_name = '" + food_name
                        + "'";

                ResultSet ingredresult = stmt.executeQuery(sql_ingred);

                while (ingredresult.next()) {
                    ingredients.add(ingredresult.getString("ingredients"));
                }

            } catch (Exception e) {
                JOptionPane.showMessageDialog(null, "Error accessing Database.");
            }
        }

        return ingredients;
    }

    /**
     *
     * This function executes two SQL statements to get the names and prices of the current menu
     * @return a vector of all the names of the current menu followed by their respective prices
     */
    public Vector<String> getMenuItems() {
        // Building the connection
        Connection conn = null;

        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }

        String food_item = "";
        String price_food = "";

        try {
            // create a statement object
            Statement stmt = conn.createStatement();
            // create a SQL statement
            String sqlfoodname = "SELECT food_name FROM food_item";
            String sqlpricefood = "SELECT price_food FROM food_item";
            // send statement to DBMS
            ResultSet itemresult = stmt.executeQuery(sqlfoodname);
            while (itemresult.next()) {
                food_item += itemresult.getString("food_name") + "-";
            }

            ResultSet priceresult = stmt.executeQuery(sqlpricefood);
            while (priceresult.next()) {
                price_food += priceresult.getString("price_food") + " ";
            }

        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Error accessing Database.");
        }
        String[] split_food = food_item.split("-");
        String[] split_price = price_food.split(" ");
        Vector<String> itemsVector = new Vector<String>();

        // return an itemsVector that has the list of items and respective prices of the fooditems table
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < split_price.length; j++) {
                if (i == 0) {
                    itemsVector.add(split_food[j]);
                }
                if (i == 1) {
                    itemsVector.add(split_price[j]);
                }
            }
        }

        return itemsVector;

    }

    /**
     * 
     * This function takes in a Vector of Strings (returned by getIngredientsFromItem) that hold all ingredients in the menu item.
     * With this vector, the function is able to decrement each ingredient present in the menu item in the inventory,
     * and is used with getIngredientsFromItem above when in the Ordering Screen and the order is submitted.
     * 
     * @param ingredients a vector of strings containing the ingredients of a menu item
     */
    public void subtractFromInventory(Vector<String> ingredients) {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }
        // subtract one from a every ingredient in the ingredients vector in the ingredients table
        for (int i = 0; i < ingredients.size(); i++) {
            try {
                Statement stmt = conn.createStatement();
                String sql_inventory = "UPDATE inventory SET quantity = quantity - 1 WHERE ingred_name = '"
                        + ingredients.get(i) + "'";

                stmt.executeQuery(sql_inventory);

            } catch (Exception e) {

            }
        }

        //make sure inventory count does not drop below 0
        try {
            Statement stmt = conn.createStatement();
            String sqlsetZero = "UPDATE inventory SET quantity = 0 WHERE quantity <= 0";
            stmt.executeQuery(sqlsetZero);

        } catch (Exception l) {

        }
    }

    /**
     * 
     * This function takes in a parameter for each column of the orders table in our database.
     * It sets the parameters to variables to run in a SQL command to instruct the database to update a new row
     * with the new information so a new order can be created in the table.
     * 
     * The function is implemented whenever an order is submitted.
     * 
     * @param order_num order number
     * @param order_item menu item name
     * @param order_price price of menu item
     * @param dine_in dine in option
     * @param cashier_id cashier id
     * @param order_time order time
     * @param order_date order date
     * which are correspond to columns in orders table
     */
    public void updateOrderHistory(long order_num, String order_item, double order_price, String dine_in,
            int cashier_id, String order_time, String order_date) {
        // Building the connection
        Connection conn = null;
        try {
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-db.engr.tamu.edu/csce315_901_03db",
                    "csce315_901_03user",
                    "90103");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName() + ": " + e.getMessage());
            System.exit(0);
        }

        try {

            Statement stmt = conn.createStatement();
            String sqlStatement = String.format(
                    "INSERT INTO orders (order_num, order_date, order_time, order_item, order_price, dine_in, cashier_id) VALUES(%s, '%s', '%s', '%s', %s, '%s', %s);",
                    order_num, order_date, order_time, order_item, order_price, dine_in, cashier_id);
            ResultSet result = stmt.executeQuery(sqlStatement);

        } catch (Exception e) {

        }
    }

    /**
     * This is main. It calls the PointOfSaleGUI function.
     * 
     * @param args[]
     */
    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new PointOfSaleGUI().setVisible(true);
            }
        });
    }
}